import { FsByteStore } from '@MNI/blob-storage';
import { Service } from '@MNI/di';

import { ErrorReporter } from '@/errors';
import { StorageConfig } from '@/storage.config';

/**
 * The `fs` byte store rooted at `MNI_STORAGE_PATH`, shared by every domain that
 * persists blobs there. Needed because `FsByteStore` takes plain options and
 * carries no DI decorators, so injecting one requires a registered subclass.
 */
@Service()
export class FsByteStoreService extends FsByteStore {
	constructor(storageConfig: StorageConfig, errorReporter: ErrorReporter) {
		super({
			storagePath: storageConfig.storagePath,
			reportError: (error) => errorReporter.error(error),
		});
	}
}
