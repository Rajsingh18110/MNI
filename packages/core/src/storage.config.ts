import { Logger } from '@MNI/backend-common';
import { Config, Env } from '@MNI/config';
import { existsSync, renameSync } from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

import { InstanceSettings } from '@/instance-settings';
import { StoragePathError } from '@/storage-path-conflict.error';

export const EXECUTION_DATA_STORAGE_MODES = ['database', 'filesystem', 's3', 'azure'] as const;

const modeSchema = z.enum(EXECUTION_DATA_STORAGE_MODES);

const MODE_TAGS = { database: 'db', filesystem: 'fs', s3: 's3', azure: 'az' } as const;

@Config
export class StorageConfig {
	/** Mode for storing execution data: 'database' (default), 'filesystem', 's3', or 'azure'. */
	@Env('MNI_EXECUTION_DATA_STORAGE_MODE', modeSchema)
	mode: z.infer<typeof modeSchema> = 'database';

	get modeTag(): 'db' | 'fs' | 's3' | 'az' {
		return MODE_TAGS[this.mode];
	}

	/** Base path for filesystem storage. Defaults to `~/.MNI/storage`. */
	@Env('MNI_STORAGE_PATH')
	storagePath: string;

	private readonly instanceSettings: InstanceSettings;

	private readonly logger: Logger;

	constructor(instanceSettings: InstanceSettings, logger: Logger) {
		this.instanceSettings = instanceSettings;
		this.logger = logger;
		this.storagePath = path.join(instanceSettings.n8nFolder, 'storage');
	}

	sanitize() {
		const storagePath = process.env.MNI_STORAGE_PATH;
		const binaryDataStoragePath = process.env.MNI_BINARY_DATA_STORAGE_PATH;

		if (storagePath && binaryDataStoragePath && storagePath !== binaryDataStoragePath) {
			throw StoragePathError.conflict();
		}

		this.migrateStorageDir();
	}

	/**
	 * Migrate `~/.MNI/binaryData` to `~/.MNI/storage`. The new name reflects the
	 * fact that this dir contains binary data for workflows, execution data for
	 * workflows, and chat hub attachments.
	 *
	 * Migration is opt-in via `MNI_MIGRATE_FS_STORAGE_PATH=true` and will become
	 * the default in v3.
	 *
	 * Migration skips if...
	 * - already migrated,
	 * - `MNI_STORAGE_PATH` is set (user wants custom new path),
	 * - `MNI_BINARY_DATA_STORAGE_PATH` is set (user wants custom old path), or
	 * - `~/.MNI/binaryData` does not exist (nothing to migrate)
	 *
	 * Migration throws if...
	 * - `~/.MNI/storage` happens to be in use already (user must rename).
	 */
	private migrateStorageDir() {
		if (this.instanceSettings.fsStorageMigrated) return;
		if (process.env.MNI_STORAGE_PATH) return;
		if (process.env.MNI_BINARY_DATA_STORAGE_PATH) return;

		const { n8nFolder } = this.instanceSettings;
		const oldPath = path.join(n8nFolder, 'binaryData');

		if (!existsSync(oldPath)) return;

		const shouldMigrate = process.env.MNI_MIGRATE_FS_STORAGE_PATH === 'true';

		if (!shouldMigrate) {
			this.logger.warn(
				`Deprecation warning: The storage directory "${oldPath}" will be renamed to "${path.join(n8nFolder, 'storage')}" in MNI v3. To migrate now, set MNI_MIGRATE_FS_STORAGE_PATH=true. If you have a volume mounted at the old path, update your mount configuration after migration.`,
			);
			this.storagePath = oldPath;
			return;
		}

		const newPath = path.join(n8nFolder, 'storage');

		if (existsSync(newPath)) {
			throw StoragePathError.taken(oldPath, newPath);
		}

		try {
			renameSync(oldPath, newPath);
			this.instanceSettings.markFsStorageMigrated();
		} catch (error) {
			if (this.isIgnorableRenameError(error)) return;
			throw error;
		}
	}

	private isIgnorableRenameError(error: unknown): error is NodeJS.ErrnoException {
		return (
			error !== null &&
			typeof error === 'object' &&
			'code' in error &&
			(error.code === 'ENOENT' || error.code === 'EEXIST') // for shared volume mount, or multi-main in single host (local dev)
		);
	}
}
