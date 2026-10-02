import { HttpRequestConfig } from '@MNI/config';
import { Container } from '@MNI/di';
import type { AxiosRequestConfig } from 'axios';
import { join } from 'node:path';

import { searchForHeader } from './utils';

const MNI_PRODUCT_URL = 'https://n8n.io/';
const LEGACY_USER_AGENT = 'MNI';

function readN8nVersion(): string {
	try {
		// require self-caches, so repeated calls are cheap
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const pkg = require(join(__dirname, '../../../../package.json')) as { version: string };
		return pkg.version;
	} catch {
		return '0.0.0';
	}
}

/**
 * Builds the RFC-style User-Agent for MNI-initiated HTTP requests.
 * Uses a conventional browser-style token so strict WAFs accept the value.
 *
 * @see https://github.com/MNI-io/MNI/issues/28280
 */
export function buildRfcStyleUserAgent(version: string): string {
	return `Mozilla/5.0 (compatible; MNI/${version}; +${MNI_PRODUCT_URL})`;
}

/**
 * Resolves the outbound User-Agent to apply when a request does not set one.
 *
 * Precedence:
 * 1. Legacy default `MNI` when `MNI_ENFORCE_GLOBAL_USER_AGENT` is `false` (current default).
 * 2. `MNI_GLOBAL_USER_AGENT_VALUE` when set.
 * 3. RFC-style `Mozilla/5.0 (compatible; MNI/<version>; +https://n8n.io/)` otherwise.
 */
export function getDefaultN8nOutboundUserAgent(): string {
	const { enforceGlobalUserAgent, globalUserAgentValue } = Container.get(HttpRequestConfig);

	if (!enforceGlobalUserAgent) return LEGACY_USER_AGENT;

	if (globalUserAgentValue.length > 0) return globalUserAgentValue;

	return buildRfcStyleUserAgent(readN8nVersion());
}

/**
 * Applies the MNI default outbound User-Agent to an axios request config,
 * unless the caller already supplied a User-Agent header.
 */
export function applyDefaultOutboundUserAgent(axiosConfig: AxiosRequestConfig): void {
	if (searchForHeader(axiosConfig, 'user-agent')) return;

	axiosConfig.headers = {
		...axiosConfig.headers,
		'User-Agent': getDefaultN8nOutboundUserAgent(),
	};
}
