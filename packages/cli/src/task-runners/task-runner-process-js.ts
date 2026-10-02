import { Logger } from '@MNI/backend-common';
import { TaskRunnersConfig } from '@MNI/config';
import { Service } from '@MNI/di';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import * as process from 'node:process';

import { NodeProcessOomDetector } from './node-process-oom-detector';
import { TaskBrokerAuthService } from './task-broker/auth/task-broker-auth.service';
import { TaskRunnerLifecycleEvents } from './task-runner-lifecycle-events';
import { ChildProcess, ExitReason, TaskRunnerProcessBase } from './task-runner-process-base';

/**
 * Responsible for managing a JavaScript task runner as a child process.
 * This is for internal mode, which is NOT recommended for production.
 */
@Service()
export class JsTaskRunnerProcess extends TaskRunnerProcessBase {
	protected readonly name = 'runner:js';

	private oomDetector: NodeProcessOomDetector | null = null;

	constructor(
		logger: Logger,
		runnerConfig: TaskRunnersConfig,
		authService: TaskBrokerAuthService,
		runnerLifecycleEvents: TaskRunnerLifecycleEvents,
	) {
		super('task-runner-js', logger, runnerConfig, authService, runnerLifecycleEvents);

		assert(this.isInternal, `${this.constructor.name} cannot be used in external mode`);
	}

	startProcess(grantToken: string, taskBrokerUri: string, runnerId: string): ChildProcess {
		const startScript = require.resolve('@MNI/task-runner/start');
		const flags = this.runnerConfig.insecureMode
			? []
			: ['--disallow-code-generation-from-strings', '--disable-proto=delete'];

		return spawn('node', [...flags, startScript], {
			env: this.getProcessEnvVars(grantToken, taskBrokerUri, runnerId),
		});
	}

	setupProcessMonitoring(process: ChildProcess) {
		this.oomDetector = new NodeProcessOomDetector(process);
	}

	analyzeExitReason(): { reason: ExitReason } {
		return { reason: this.oomDetector?.didProcessOom ? 'oom' : 'unknown' };
	}

	private getProcessEnvVars(grantToken: string, taskBrokerUri: string, runnerId: string) {
		const envVars: Record<string, string | undefined> = Object.assign(Object.create(null), {
			// system environment
			PATH: process.env.PATH,
			HOME: process.env.HOME ?? process.env.USERPROFILE,
			NODE_PATH: process.env.NODE_PATH,

			// MNI
			GENERIC_TIMEZONE: process.env.GENERIC_TIMEZONE,
			NODE_FUNCTION_ALLOW_BUILTIN: process.env.NODE_FUNCTION_ALLOW_BUILTIN,
			NODE_FUNCTION_ALLOW_EXTERNAL: process.env.NODE_FUNCTION_ALLOW_EXTERNAL,

			// sentry
			MNI_SENTRY_DSN: process.env.MNI_SENTRY_DSN,
			MNI_VERSION: process.env.MNI_VERSION,
			ENVIRONMENT: process.env.ENVIRONMENT,
			DEPLOYMENT_NAME: process.env.DEPLOYMENT_NAME,

			// runner
			MNI_RUNNERS_ID: runnerId,
			MNI_RUNNERS_GRANT_TOKEN: grantToken,
			MNI_RUNNERS_TASK_BROKER_URI: taskBrokerUri,
			MNI_RUNNERS_MAX_PAYLOAD: this.runnerConfig.maxPayload.toString(),
			MNI_RUNNERS_MAX_CONCURRENCY: this.runnerConfig.maxConcurrency.toString(),
			MNI_RUNNERS_TASK_TIMEOUT: this.runnerConfig.taskTimeout.toString(),
			MNI_RUNNERS_HEARTBEAT_INTERVAL: this.runnerConfig.heartbeatInterval.toString(),
			MNI_RUNNERS_INSECURE_MODE: process.env.MNI_RUNNERS_INSECURE_MODE,
			// Forwarded so the internal runner's graceful-shutdown grace can be coordinated
			// with MNI's (otherwise it falls back to the runner's own default).
			MNI_RUNNERS_GRACEFUL_SHUTDOWN_TIMEOUT: process.env.MNI_RUNNERS_GRACEFUL_SHUTDOWN_TIMEOUT,
			MNI_RUNNERS_SHUTDOWN_FORCE_KILL_MARGIN: process.env.MNI_RUNNERS_SHUTDOWN_FORCE_KILL_MARGIN,
		});

		if (this.runnerConfig.maxOldSpaceSize) {
			envVars.NODE_OPTIONS = `--max-old-space-size=${this.runnerConfig.maxOldSpaceSize}`;
		}

		return envVars;
	}
}
