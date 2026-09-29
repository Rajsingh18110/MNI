/**
 * Store Version Operation
 *
 * This module provides the operation for storing the MNI version
 * through the coordinator to the active tab's data worker.
 */

import { withActiveWorker } from '../utils';

/**
 * Store the MNI version (routes to active tab's worker)
 *
 * @param state - The coordinator state
 * @param version - The MNI version string
 */
export const storeVersion = withActiveWorker(async (worker, version: string) => {
	console.log('[Coordinator] storeVersion:', version);
	return await worker.storeVersion(version);
});

/**
 * Get the stored MNI version (routes to active tab's worker)
 *
 * @param state - The coordinator state
 * @returns The stored version string or null if not found
 */
export const getStoredVersion = withActiveWorker(async (worker) => {
	console.log('[Coordinator] getStoredVersion');
	return await worker.getStoredVersion();
});
