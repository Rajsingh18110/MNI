import { Logger } from '@MNI/backend-common';
import { TaskRunnersConfig } from '@MNI/config';
import { Service } from '@MNI/di';
import { exec, spawn } from 'node:child_process';
import { access } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

import { TaskBrokerAuthService } from './task-broker/auth/task-broker-auth.service';
import { TaskRunnerLifecycleEvents } from './task-runner-lifecycle-events';
import { TaskRunnerProcessBase } from './task-runner-process-base';

const asyncExec = promisify(exec);

/**
 * Responsible for managing a Python task runner as a child process.
 * This is for internal mode, which is NOT recommended for production.
 */
@Service()
export class PyTaskRunnerProcess extends TaskRunnerProcessBase {
	protected readonly name = 'runner:py';

	constructor(
		logger: Logger,
		runnerConfig: TaskRunnersConfig,
		authService: TaskBrokerAuthService,
		runnerLifecycleEvents: TaskRunnerLifecycleEvents,
	) {
		super('task-runner-py', logger, runnerConfig, authService, runnerLifecycleEvents);
	}

	startProcess(grantToken: string, taskBrokerUri: string, runnerId: string) {
		const pythonDir = path.join(__dirname, '../../../@MNI/task-runner-python');
		const venvPath = PyTaskRunnerProcess.getVenvPath();

		return spawn(venvPath, ['-m', 'src.main'], {
			cwd: pythonDir,
			env: Object.assign(Object.create(null), {
				// system environment
				PATH: process.env.PATH,
				HOME: process.env.HOME ?? process.env.USERPROFILE,

				// runner
				MNI_RUNNERS_ID: runnerId,
				MNI_RUNNERS_GRANT_TOKEN: grantToken,
				MNI_RUNNERS_TASK_BROKER_URI: taskBrokerUri,
				MNI_RUNNERS_MAX_PAYLOAD: this.runnerConfig.maxPayload.toString(),
				MNI_RUNNERS_MAX_CONCURRENCY: this.runnerConfig.maxConcurrency.toString(),
				MNI_RUNNERS_TASK_TIMEOUT: this.runnerConfig.taskTimeout.toString(),
				MNI_RUNNERS_HEARTBEAT_INTERVAL: this.runnerConfig.heartbeatInterval.toString(),

				// MNI
				MNI_RUNNERS_STDLIB_ALLOW: process.env.MNI_RUNNERS_STDLIB_ALLOW,
				MNI_RUNNERS_EXTERNAL_ALLOW: process.env.MNI_RUNNERS_EXTERNAL_ALLOW,
				MNI_RUNNERS_ALLOW_TRANSITIVE_IMPORTS: process.env.MNI_RUNNERS_ALLOW_TRANSITIVE_IMPORTS,
				MNI_RUNNERS_BUILTINS_DENY: process.env.MNI_RUNNERS_BUILTINS_DENY,
				MNI_BLOCK_RUNNER_ENV_ACCESS: process.env.MNI_BLOCK_RUNNER_ENV_ACCESS,
			}),
		});
	}

	/**
	 * Check if Python requirements are met for internal mode.
	 * Returns the failure reason if requirements are missing, or `null` if all requirements are met.
	 */
	static async checkRequirements(): Promise<'python' | 'venv' | null> {
		try {
			if (process.platform === 'win32') {
				const { stdout, stderr } = await asyncExec('python --version', { timeout: 5000 });
				// Python 2 prints version to stderr, Python 3 to stdout
				const output = (stdout + stderr).trim();
				if (!output.startsWith('Python 3')) {
					return 'python';
				}
			} else {
				await asyncExec('python3 --version', { timeout: 5000 });
			}
		} catch {
			return 'python';
		}

		try {
			await access(PyTaskRunnerProcess.getVenvPath());
		} catch {
			return 'venv';
		}

		return null;
	}

	/** Public so tests can decide synchronously whether the runner can be started. */
	static getVenvPath() {
		const pythonDir = path.join(__dirname, '../../../@MNI/task-runner-python');
		const isWindows = process.platform === 'win32';
		const venvBin = isWindows ? 'Scripts' : 'bin';
		const pythonExe = isWindows ? 'python.exe' : 'python';
		return path.join(pythonDir, '.venv', venvBin, pythonExe);
	}
}
