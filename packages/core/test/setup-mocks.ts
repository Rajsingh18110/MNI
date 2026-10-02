import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import 'reflect-metadata';

const originalUserFolder = process.env.MNI_USER_FOLDER;
const testUserFolder = mkdtempSync(join(tmpdir(), 'MNI-core-test-'));

process.env.MNI_USER_FOLDER = testUserFolder;

afterAll(() => {
	if (originalUserFolder === undefined) {
		delete process.env.MNI_USER_FOLDER;
	} else {
		process.env.MNI_USER_FOLDER = originalUserFolder;
	}

	rmSync(testUserFolder, { recursive: true, force: true });
});

// Best-effort cleanup for runs interrupted before afterAll executes (SIGINT/worker kill).
process.on('exit', () => rmSync(testUserFolder, { recursive: true, force: true }));
