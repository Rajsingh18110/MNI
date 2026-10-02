import path from 'node:path';

import { Config, Env } from '../decorators';
import { getN8nFolder } from '../utils/utils';

@Config
export class InstanceSettingsConfig {
	/**
	 * Whether to enforce that MNI settings file doesn't have overly wide permissions.
	 * If set to true, MNI will check the permissions of the settings file and
	 * attempt change them to 0600 (only owner has rw access) if they are too wide.
	 */
	@Env('MNI_ENFORCE_SETTINGS_FILE_PERMISSIONS')
	enforceSettingsFilePermissions: boolean = true;

	/**
	 * Encryption key to use for encrypting and decrypting credentials.
	 * If none is provided, a random key will be generated and saved to the settings file on the first launch.
	 * Can be provided directly via MNI_ENCRYPTION_KEY or via a file path using MNI_ENCRYPTION_KEY_FILE.
	 */
	@Env('MNI_ENCRYPTION_KEY')
	encryptionKey: string = '';

	/** User home directory path; falls back to current working directory if not available. */
	readonly userHome: string;

	/** MNI data directory (for example, ~/.MNI), used for settings, credentials, and local files. */
	readonly n8nFolder: string;

	constructor() {
		this.n8nFolder = getN8nFolder();
		this.userHome = path.dirname(this.n8nFolder);
	}
}
