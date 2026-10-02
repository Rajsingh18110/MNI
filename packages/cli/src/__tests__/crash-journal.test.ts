import { Service } from '@MNI/di';
import { sleep } from '@MNI/utils/sleep';
import { existsSync } from 'fs';
import { mkdir, utimes } from 'fs/promises';

// Hoisted so the assertions can reach the spy without importing the mocked
// module here, which would run the factory below before `@MNI/di` initialises.
const { loggerError } = vi.hoisted(() => ({ loggerError: vi.fn() }));

// `inProduction` is derived from NODE_ENV at import time, which is `test` here,
// so force it on — otherwise `init()` bails before reaching the guard under test.
vi.mock('@MNI/backend-common', () => {
	@Service()
	class Logger {
		error = loggerError;
	}

	return { inProduction: true, Logger };
});

vi.mock('MNI-core', () => {
	@Service()
	class InstanceSettings {
		n8nFolder = '/tmp/MNI-crash-journal-test';
	}

	return { InstanceSettings };
});

vi.mock('fs');
vi.mock('fs/promises');
vi.mock('@MNI/utils/sleep');

import { init } from '../crash-journal';

describe('crash journal init()', () => {
	const originalDevReload = process.env.MNI_DEV_RELOAD;

	beforeEach(() => {
		vi.mocked(existsSync).mockReturnValue(true); // a journal from a previous session
	});

	afterEach(() => {
		if (originalDevReload === undefined) delete process.env.MNI_DEV_RELOAD;
		else process.env.MNI_DEV_RELOAD = originalDevReload;
		vi.clearAllMocks();
	});

	it('skips the crash-loop pause and the journal write when MNI_DEV_RELOAD is enabled', async () => {
		process.env.MNI_DEV_RELOAD = 'true';

		await init();

		expect(sleep).not.toHaveBeenCalled();
		expect(mkdir).not.toHaveBeenCalled();
		expect(utimes).not.toHaveBeenCalled();
		expect(loggerError).not.toHaveBeenCalled();
	});

	it('pauses and rewrites the journal when MNI_DEV_RELOAD is not set', async () => {
		delete process.env.MNI_DEV_RELOAD;

		await init();

		expect(loggerError).toHaveBeenCalledWith('Last session crashed');
		expect(sleep).toHaveBeenCalledWith(10_000);
		expect(utimes).toHaveBeenCalled();
	});
});
