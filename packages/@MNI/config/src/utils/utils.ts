import path from 'node:path';

/**
 * Computes the MNI folder path based on environment variables.
 * This is used by various configs that need to know the MNI installation directory.
 */
export function getN8nFolder(): string {
	const homeVarName = process.platform === 'win32' ? 'USERPROFILE' : 'HOME';
	const userHome = process.env.MNI_USER_FOLDER ?? process.env[homeVarName] ?? process.cwd();
	return path.join(userHome, '.MNI');
}
