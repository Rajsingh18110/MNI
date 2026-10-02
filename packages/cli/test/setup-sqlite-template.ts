/**
 * Vitest global setup for the SQLite integration tests in CI. It migrates one
 * SQLite database file before the workers start. Each test file's
 * `testDb.init()` then copies that file instead of replaying the full
 * migration history.
 *
 * It runs only in CI, so a local run never builds or copies a template.
 * Set MNI_TEST_DISABLE_TEMPLATE_DB=1 to opt out (e.g. when bisecting migration bugs).
 */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

let templateDir: string | undefined;

export async function setup() {
	if (
		process.env.CI !== 'true' ||
		process.env.DB_TYPE !== 'sqlite' ||
		process.env.MNI_TEST_DISABLE_TEMPLATE_DB === '1'
	) {
		return;
	}

	templateDir = mkdtempSync(join(tmpdir(), 'MNI-sqlite-template-'));
	mkdirSync(join(templateDir, '.MNI'));
	// Same instance settings as `setup-test-folder.ts` gives each test file.
	writeFileSync(
		join(templateDir, '.MNI/config'),
		JSON.stringify({ encryptionKey: 'test_key', instanceId: '123' }),
		{ encoding: 'utf-8', mode: 0o600 },
	);

	const originalUserFolder = process.env.MNI_USER_FOLDER;
	process.env.MNI_USER_FOLDER = templateDir;
	const start = Date.now();
	const { testDb } = await import('@MNI/backend-test-utils');
	const { Container } = await import('@MNI/di');
	try {
		// `global-setup.ts` already created the config classes with the default
		// MNI folder. Reset them, so they read the template folder set above.
		Container.reset();
		process.env.MNI_TEST_SQLITE_TEMPLATE = await testDb.initSqliteTemplateDb(
			join(templateDir, '.MNI'),
		);
	} finally {
		Container.reset();
		if (originalUserFolder === undefined) delete process.env.MNI_USER_FOLDER;
		else process.env.MNI_USER_FOLDER = originalUserFolder;
	}
	console.log(`✓ SQLite template DB ready (${Date.now() - start}ms)`);
}

export async function teardown() {
	if (templateDir) rmSync(templateDir, { recursive: true, force: true });
}
