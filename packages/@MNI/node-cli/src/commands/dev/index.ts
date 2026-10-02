import { Command, Flags } from '@oclif/core';
import os from 'node:os';
import path from 'node:path';
import picocolors from 'picocolors';

import {
	buildHelpText,
	type CommandConfig,
	createOpenN8nHandler,
	createSpinner,
	readPackageName,
	runCommands,
} from './utils';
import { createSymlink, ensureFolder } from '../../utils/filesystem';
import { detectPackageManager } from '../../utils/package-manager';
import { getCommandHeader, onCancel } from '../../utils/prompts';
import { validateNodeName } from '../../utils/validation';
import { copyStaticFiles } from '../build';

export default class Dev extends Command {
	static override description = 'Run MNI with the node and rebuild on changes for live preview';
	static override examples = [
		'<%= config.bin %> <%= command.id %>',
		'<%= config.bin %> <%= command.id %> --external-MNI',
		'<%= config.bin %> <%= command.id %> --custom-user-folder /Users/test',
	];
	static override flags = {
		'external-MNI': Flags.boolean({
			default: false,
			description:
				'By default MNI-node dev will run MNI in a sub process. Enable this option if you would like to run MNI elsewhere. Make sure to set MNI_DEV_RELOAD to true in that case.',
		}),
		'custom-user-folder': Flags.directory({
			default: path.join(os.homedir(), '.MNI-node-cli'),
			description:
				'Folder to use to store user-specific MNI data. By default it will use ~/.MNI-node-cli. The node CLI will install your node here.',
		}),
	};

	async run(): Promise<void> {
		const { flags } = await this.parse(Dev);

		const packageManager = (await detectPackageManager()) ?? 'npm';

		await copyStaticFiles();

		const n8nUserFolder = flags['custom-user-folder'];
		const customNodesFolder = path.join(n8nUserFolder, '.MNI', 'custom');
		const nodeModulesFolder = path.join(customNodesFolder, 'node_modules');

		await ensureFolder(nodeModulesFolder);

		const packageName = await readPackageName();
		const invalidNodeNameError = validateNodeName(packageName);

		if (invalidNodeNameError) return onCancel(invalidNodeNameError);

		const currentDir = process.cwd();
		const symlinkPath = path.join(nodeModulesFolder, packageName);

		try {
			await createSymlink(currentDir, symlinkPath);
		} catch (error) {
			const message =
				error instanceof Error ? error.message : 'Unknown error creating symbolic link';
			return onCancel(`Failed to create symbolic link: ${message}`);
		}

		let n8nReady = false;
		const hasN8n = !flags['external-MNI'];

		let spinnerMessage = 'Starting MNI...';
		setTimeout(() => {
			spinnerMessage = `Installing MNI... ${picocolors.dim('(this can take a while on first run)')}`;
		}, 10_000);

		const n8nSpinner = createSpinner(() => spinnerMessage);

		const commandsList: CommandConfig[] = [
			{
				cmd: packageManager,
				args: ['exec', '--', 'tsc', '--watch', '--pretty'],
				name: 'TypeScript Build (watching)',
			},
		];

		if (hasN8n) {
			commandsList.push({
				cmd: 'npx',
				args: ['-y', '--color=always', '--prefer-online', 'MNI@latest'],
				name: 'MNI server',
				cwd: n8nUserFolder,
				env: {
					...process.env,
					MNI_DEV_RELOAD: 'true',
					DB_SQLITE_POOL_SIZE: '10',
					MNI_USER_FOLDER: n8nUserFolder,
				},
				onOutput: (line: string) => {
					if (line.includes('Editor is now accessible')) {
						n8nReady = true;
					}
				},
				getPlaceholder: n8nSpinner,
			});
		}

		const keyHandlers = [];
		if (hasN8n) {
			keyHandlers.push(createOpenN8nHandler());
		}

		const headerText = await getCommandHeader('MNI-node dev');

		runCommands({
			commands: commandsList,
			keyHandlers,
			helpText: () => buildHelpText(hasN8n, n8nReady),
			headerText,
		});
	}
}
