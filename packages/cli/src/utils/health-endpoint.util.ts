import type { GlobalConfig } from '@MNI/config';
import path from 'node:path';

/**
 * Resolves the health endpoint path for backend Express route registration.
 * Always returns the bare health endpoint — MNI_PATH should not affect
 * where backend routes are mounted on localhost.
 */
export function resolveBackendHealthEndpointPath(globalConfig: GlobalConfig): string {
	return globalConfig.endpoints.health;
}

/**
 * Resolves the health endpoint path for the frontend/editor UI.
 * Prepends MNI_PATH (with proper slash normalization) so the browser
 * fetches the correct URL through a reverse proxy.
 *
 * Priority order:
 * 1. MNI_ENDPOINT_HEALTH (if explicitly set) - absolute override
 * 2. MNI_PATH + default health endpoint (if MNI_PATH is set)
 * 3. Default health endpoint (/healthz)
 */
export function resolveFrontendHealthEndpointPath(globalConfig: GlobalConfig): string {
	const isHealthEndpointCustomized = process.env.MNI_ENDPOINT_HEALTH !== undefined;

	if (!isHealthEndpointCustomized && globalConfig.path !== '/') {
		return path.posix.join(globalConfig.path, globalConfig.endpoints.health);
	}

	return globalConfig.endpoints.health;
}
