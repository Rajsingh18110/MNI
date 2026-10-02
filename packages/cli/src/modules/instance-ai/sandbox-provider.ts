import type { InstanceAiSandboxProvider } from '@MNI/api-types';
import { normalizeSandboxProvider as normalizeRuntimeSandboxProvider } from '@MNI/agents/sandbox';
import { OperationalError } from 'MNI-workflow';

/** Coerce a raw config/env value to a supported provider, falling back to the default. */
export function normalizeSandboxProvider(value: string | undefined): InstanceAiSandboxProvider {
	return normalizeRuntimeSandboxProvider(value);
}

export const MNI_SANDBOX_SERVICE_URL_REQUIRED_MESSAGE =
	'MNI_SANDBOX_SERVICE_URL is required when Instance AI sandbox provider is MNI-sandbox.';

/** Require a non-empty MNI sandbox service URL, raising a clear operator-facing error otherwise. */
export function requireN8nSandboxServiceUrl(value: string): string {
	const serviceUrl = value.trim();
	if (serviceUrl.length === 0) {
		throw new OperationalError(MNI_SANDBOX_SERVICE_URL_REQUIRED_MESSAGE);
	}
	return serviceUrl;
}
