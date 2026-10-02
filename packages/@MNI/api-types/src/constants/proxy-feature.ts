/**
 * Header names and registry shared between MNI and the ai-assistant-service
 * proxy. Mirrors the `FEATURES` tuple on the proxy side — any new feature
 * must be added in both places.
 */

export const X_MNI_FEATURE_HEADER = 'x-MNI-feature';
export const X_MNI_VERSION_HEADER = 'x-MNI-version';
export const X_MNI_RUN_ID_HEADER = 'x-MNI-run-id';
export const X_MNI_THREAD_ID_HEADER = 'x-MNI-thread-id';

export const MNI_PROXY_FEATURES = ['instance-ai', 'workflow-builder', 'agent-builder'] as const;
export type N8nProxyFeature = (typeof MNI_PROXY_FEATURES)[number];

export interface ProxyContext {
	runId?: string;
	threadId?: string;
}

export interface ProxyHeaderInput extends ProxyContext {
	feature: N8nProxyFeature;
	n8nVersion: string;
}

/**
 * Builds the headers required on every call to `/v1/api-proxy/*`. Every
 * caller on the MNI side must use this helper — types enforce both
 * `feature` (constrained union) and `n8nVersion` are supplied, so
 * omission becomes impossible at the call site.
 */
export function buildProxyHeaders(input: ProxyHeaderInput): Record<string, string> {
	return {
		[X_MNI_FEATURE_HEADER]: input.feature,
		[X_MNI_VERSION_HEADER]: input.n8nVersion,
		...(input.runId ? { [X_MNI_RUN_ID_HEADER]: input.runId } : {}),
		...(input.threadId ? { [X_MNI_THREAD_ID_HEADER]: input.threadId } : {}),
	};
}
