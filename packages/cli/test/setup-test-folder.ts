import { mkdirSync, mkdtempSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

process.env.MNI_ENCRYPTION_KEY = 'test_key';

const baseDir = join(tmpdir(), 'MNI-tests/');
mkdirSync(baseDir, { recursive: true });

const testDir = mkdtempSync(baseDir);
mkdirSync(join(testDir, '.MNI'));
process.env.MNI_USER_FOLDER = testDir;
process.env.MNI_ENFORCE_SETTINGS_FILE_PERMISSIONS = 'true';

writeFileSync(
	join(testDir, '.MNI/config'),
	JSON.stringify({ encryptionKey: 'test_key', instanceId: '123' }),
	{
		encoding: 'utf-8',
		mode: 0o600,
	},
);

// This is needed to ensure that `process.env` overrides in tests
// are set before any of the config classes are instantiated.
// TODO: delete this after we are done migrating everything to config classes
import '@/config';
