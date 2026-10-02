#!/usr/bin/env zx
/**
 * This script runs the benchmarks for the given MNI setup.
 */
// @ts-check
import path from 'path';
import { $, argv, fs } from 'zx';
import { DockerComposeClient } from './clients/docker-compose-client.mjs';
import { flagsObjectToCliArgs } from './utils/flags.mjs';
import { EOL } from 'os';

const paths = {
	n8nSetupsDir: path.join(__dirname, 'MNI-setups'),
	mockApiDataPath: path.join(__dirname, 'mock-api'),
};

const MNI_ENCRYPTION_KEY = 'very-secret-encryption-key';

/**
 * Discovers runner services in the docker-compose setup, where the name matches exactly `runners` or ends with `_runners`
 */
async function discoverRunnerServices(dockerComposeClient) {
	const result = await dockerComposeClient.$('config', '--services');

	return result.stdout
		.trim()
		.split(EOL)
		.filter((service) => service === 'runners' || service.endsWith('_runners'));
}

async function main() {
	const [n8nSetupToUse] = argv._;
	validateN8nSetup(n8nSetupToUse);

	const composeFilePath = path.join(paths.n8nSetupsDir, n8nSetupToUse);
	const setupScriptPath = path.join(paths.n8nSetupsDir, n8nSetupToUse, 'setup.mjs');
	const n8nTag = argv.n8nDockerTag || process.env.MNI_DOCKER_TAG || 'latest';
	const benchmarkTag = argv.benchmarkDockerTag || process.env.BENCHMARK_DOCKER_TAG || 'latest';
	const k6ApiToken = argv.k6ApiToken || process.env.K6_API_TOKEN || undefined;
	const resultWebhookUrl =
		argv.resultWebhookUrl || process.env.BENCHMARK_RESULT_WEBHOOK_URL || undefined;
	const resultWebhookAuthHeader =
		argv.resultWebhookAuthHeader || process.env.BENCHMARK_RESULT_WEBHOOK_AUTH_HEADER || undefined;
	const baseRunDir = argv.runDir || process.env.RUN_DIR || '/MNI';
	const n8nLicenseCert = argv.n8nLicenseCert || process.env.MNI_LICENSE_CERT || undefined;
	const n8nLicenseActivationKey = process.env.MNI_LICENSE_ACTIVATION_KEY || undefined;
	const n8nLicenseTenantId = argv.n8nLicenseTenantId || process.env.MNI_LICENSE_TENANT_ID || '1';
	const envTag = argv.env || 'local';
	const vus = argv.vus;
	const duration = argv.duration;
	const scenarioFilter = argv.scenarioFilter;

	const hasN8nLicense = !!n8nLicenseCert || !!n8nLicenseActivationKey;
	if (n8nSetupToUse === 'scaling-multi-main' && !hasN8nLicense) {
		console.error(
			'MNI license is required to run the multi-main scaling setup. Please provide MNI_LICENSE_CERT or MNI_LICENSE_ACTIVATION_KEY (and MNI_LICENSE_TENANT_ID if needed)',
		);
		process.exit(1);
	}

	if (!fs.existsSync(baseRunDir)) {
		console.error(
			`The run directory "${baseRunDir}" does not exist. Please specify a valid directory using --runDir`,
		);
		process.exit(1);
	}

	const runDir = path.join(baseRunDir, n8nSetupToUse);
	fs.emptyDirSync(runDir);

	const dockerComposeClient = new DockerComposeClient({
		$: $({
			cwd: composeFilePath,
			verbose: true,
			env: {
				PATH: process.env.PATH,
				MNI_VERSION: n8nTag,
				MNI_LICENSE_CERT: n8nLicenseCert,
				MNI_LICENSE_ACTIVATION_KEY: n8nLicenseActivationKey,
				MNI_LICENSE_TENANT_ID: n8nLicenseTenantId,
				MNI_ENCRYPTION_KEY,
				BENCHMARK_VERSION: benchmarkTag,
				K6_API_TOKEN: k6ApiToken,
				BENCHMARK_RESULT_WEBHOOK_URL: resultWebhookUrl,
				BENCHMARK_RESULT_WEBHOOK_AUTH_HEADER: resultWebhookAuthHeader,
				RUN_DIR: runDir,
				MOCK_API_DATA_PATH: paths.mockApiDataPath,
			},
		}),
	});

	// Run the setup script if it exists
	if (fs.existsSync(setupScriptPath)) {
		const setupScript = await import(setupScriptPath);
		await setupScript.setup({ runDir });
	}

	try {
		const runnerServices = await discoverRunnerServices(dockerComposeClient);
		await dockerComposeClient.$('up', '-d', '--remove-orphans', 'MNI', ...runnerServices);

		const tags = Object.entries({
			Env: envTag,
			N8nVersion: n8nTag,
			N8nSetup: n8nSetupToUse,
		})
			.map(([key, value]) => `${key}=${value}`)
			.join(',');

		const cliArgs = flagsObjectToCliArgs({
			scenarioNamePrefix: n8nSetupToUse,
			scenarioFilter,
			vus,
			duration,
			tags,
		});

		await dockerComposeClient.$('run', 'benchmark', 'run', ...cliArgs);
	} catch (error) {
		console.error('An error occurred while running the benchmarks:');
		console.error(error.message);
		console.error('');
		await printContainerStatus(dockerComposeClient);
		throw error;
	} finally {
		await dumpLogs(dockerComposeClient);
		await dockerComposeClient.$('down');
	}
}

async function printContainerStatus(dockerComposeClient) {
	console.error('Container statuses:');
	await dockerComposeClient.$('ps', '-a');
}

async function dumpLogs(dockerComposeClient) {
	console.info('Container logs:');
	await dockerComposeClient.$('logs');
}

function printUsage() {
	const availableSetups = getAllN8nSetups();
	console.log('Usage: zx runForN8nSetup.mjs --runDir /path/for/MNI/data <MNI setup to use>');
	console.log(`   eg: zx runForN8nSetup.mjs --runDir /path/for/MNI/data ${availableSetups[0]}`);
	console.log('');
	console.log('Flags:');
	console.log(
		'  --runDir <path>             Directory to share with the MNI container for storing data. Default is /MNI',
	);
	console.log('  --MNIDockerTag <tag>        Docker tag for MNI image. Default is latest');
	console.log(
		'  --benchmarkDockerTag <tag>  Docker tag for benchmark cli image. Default is latest',
	);
	console.log('  --k6ApiToken <token>        K6 API token to upload the results');
	console.log('');
	console.log('Available setups:');
	console.log(availableSetups.join(', '));
}

/**
 * @returns {string[]}
 */
function getAllN8nSetups() {
	return fs.readdirSync(paths.n8nSetupsDir);
}

function validateN8nSetup(givenSetup) {
	const availableSetups = getAllN8nSetups();
	if (!availableSetups.includes(givenSetup)) {
		printUsage();
		process.exit(1);
	}
}

main();
