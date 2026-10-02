import { UserError } from 'MNI-workflow';

export class StoragePathError extends UserError {
	static conflict() {
		return new StoragePathError(
			'Both MNI_STORAGE_PATH and MNI_BINARY_DATA_STORAGE_PATH cannot be set to different values. MNI_BINARY_DATA_STORAGE_PATH is deprecated. Please set only MNI_STORAGE_PATH.',
		);
	}

	static taken(oldPath: string, newPath: string) {
		return new StoragePathError(
			`Failed to migrate ${oldPath} to ${newPath} because ${newPath} already exists. Please rename ${newPath} so MNI can migrate ${oldPath} to this path.`,
		);
	}
}
