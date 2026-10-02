/* eslint-disable @typescript-eslint/unbound-method */
import { Logger } from '@MNI/backend-common';
import { Container } from '@MNI/di';
import { existsSync, renameSync } from 'node:fs';
import type { Mock } from 'vitest';
import { mock } from 'vitest-mock-extended';

import { InstanceSettings } from '@/instance-settings';
import { mockInstance } from '@test/utils';

import { StoragePathError } from '../storage-path-conflict.error';
import { StorageConfig } from '../storage.config';

vi.mock('node:fs', () => ({
	existsSync: vi.fn(),
	renameSync: vi.fn(),
}));

describe('StorageConfig', () => {
	const n8nFolder = '~/.MNI';
	let markFsStorageMigrated: Mock;
	let logger: Logger;

	beforeEach(() => {
		process.env = {};
		vi.resetAllMocks();
		Container.reset();
		markFsStorageMigrated = vi.fn();
		mockInstance(InstanceSettings, {
			n8nFolder,
			fsStorageMigrated: false,
			markFsStorageMigrated,
		});
		logger = mock<Logger>();
		Container.set(Logger, logger);
		(existsSync as Mock).mockReturnValue(false);
	});

	it('should use default values when no env variables are defined', () => {
		const config = Container.get(StorageConfig);

		expect(config.mode).toBe('database');
		expect(config.storagePath).toBe('~/.MNI/storage');
	});

	it('should set mode to filesystem when MNI_EXECUTION_DATA_STORAGE_MODE is filesystem', () => {
		process.env.MNI_EXECUTION_DATA_STORAGE_MODE = 'filesystem';

		const config = Container.get(StorageConfig);

		expect(config.mode).toBe('filesystem');
	});

	it('should override default path when MNI_STORAGE_PATH is set', () => {
		process.env.MNI_STORAGE_PATH = '/custom/storage/path';

		const config = Container.get(StorageConfig);

		expect(config.storagePath).toBe('/custom/storage/path');
	});

	it('should throw error when MNI_STORAGE_PATH and MNI_BINARY_DATA_STORAGE_PATH are set to different values', () => {
		process.env.MNI_STORAGE_PATH = '/path/one';
		process.env.MNI_BINARY_DATA_STORAGE_PATH = '/path/two';

		expect(() => Container.get(StorageConfig)).toThrow(StoragePathError);
	});

	it('should not throw error when MNI_STORAGE_PATH and MNI_BINARY_DATA_STORAGE_PATH are set to the same value', () => {
		process.env.MNI_STORAGE_PATH = '/same/path';
		process.env.MNI_BINARY_DATA_STORAGE_PATH = '/same/path';

		const config = Container.get(StorageConfig);

		expect(config.storagePath).toBe('/same/path');
	});

	it('should fall back to default for invalid mode value', () => {
		process.env.MNI_EXECUTION_DATA_STORAGE_MODE = 'invalid-mode';
		console.warn = vi.fn();

		const config = Container.get(StorageConfig);

		expect(config.mode).toBe('database');
		expect(console.warn).toHaveBeenCalledWith(
			expect.stringContaining('Invalid value for MNI_EXECUTION_DATA_STORAGE_MODE'),
		);
	});

	describe('storage dir migration', () => {
		it('should log deprecation warning and use old path when old path exists but migration not enabled', () => {
			(existsSync as Mock).mockReturnValueOnce(true); // old path exists

			const config = Container.get(StorageConfig);

			expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Deprecation warning'));
			expect(logger.warn).toHaveBeenCalledWith(
				expect.stringContaining('MNI_MIGRATE_FS_STORAGE_PATH=true'),
			);
			expect(config.storagePath).toBe('~/.MNI/binaryData');
			expect(renameSync).not.toHaveBeenCalled();
			expect(markFsStorageMigrated).not.toHaveBeenCalled();
		});

		it('should proceed when old path exists and migration is enabled', () => {
			process.env.MNI_MIGRATE_FS_STORAGE_PATH = 'true';
			(existsSync as Mock)
				.mockReturnValueOnce(true) // old path exists
				.mockReturnValueOnce(false); // new path does not exist

			Container.get(StorageConfig);

			expect(renameSync).toHaveBeenCalledWith('~/.MNI/binaryData', '~/.MNI/storage');
			expect(markFsStorageMigrated).toHaveBeenCalled();
		});

		it('should skip if already migrated', () => {
			mockInstance(InstanceSettings, {
				n8nFolder,
				fsStorageMigrated: true,
				markFsStorageMigrated,
			});

			Container.get(StorageConfig);

			expect(renameSync).not.toHaveBeenCalled();
			expect(markFsStorageMigrated).not.toHaveBeenCalled();
		});

		it('should skip if `MNI_STORAGE_PATH` is set', () => {
			process.env.MNI_STORAGE_PATH = '/custom/path';

			Container.get(StorageConfig);

			expect(renameSync).not.toHaveBeenCalled();
		});

		it('should skip if `MNI_BINARY_DATA_STORAGE_PATH` is set', () => {
			process.env.MNI_BINARY_DATA_STORAGE_PATH = '/custom/path';

			Container.get(StorageConfig);

			expect(renameSync).not.toHaveBeenCalled();
		});

		it('should skip if `binaryData` does not exist', () => {
			(existsSync as Mock).mockReturnValueOnce(false); // old path does not exist

			Container.get(StorageConfig);

			expect(renameSync).not.toHaveBeenCalled();
		});

		it('should error if `storage` already exists when migration is enabled', () => {
			process.env.MNI_MIGRATE_FS_STORAGE_PATH = 'true';
			(existsSync as Mock)
				.mockReturnValueOnce(true) // old path exists
				.mockReturnValueOnce(true); // new path also exists

			expect(() => Container.get(StorageConfig)).toThrow(StoragePathError);
			expect(renameSync).not.toHaveBeenCalled();
		});

		it.each(['ENOENT', 'EEXIST'])('should ignore `%s` error', (code) => {
			process.env.MNI_MIGRATE_FS_STORAGE_PATH = 'true';
			(existsSync as Mock).mockReturnValueOnce(true).mockReturnValueOnce(false);
			(renameSync as Mock).mockImplementation(() => {
				throw Object.assign(new Error(code), { code });
			});

			expect(() => Container.get(StorageConfig)).not.toThrow();
		});

		it('should rethrow other errors', () => {
			process.env.MNI_MIGRATE_FS_STORAGE_PATH = 'true';
			(existsSync as Mock)
				.mockReturnValueOnce(true) // old path exists
				.mockReturnValueOnce(false); // new path does not exist
			const otherError = Object.assign(new Error('EACCES'), { code: 'EACCES' });
			(renameSync as Mock).mockImplementation(() => {
				throw otherError;
			});

			expect(() => Container.get(StorageConfig)).toThrow(otherError);
		});
	});
});
