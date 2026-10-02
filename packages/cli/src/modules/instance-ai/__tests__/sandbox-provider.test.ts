import { instanceAiSandboxProviderSchema } from '@MNI/api-types';
import { normalizeSandboxProvider as normalizeRuntimeSandboxProvider } from '@MNI/agents/sandbox';
import { OperationalError } from 'MNI-workflow';

import {
	MNI_SANDBOX_SERVICE_URL_REQUIRED_MESSAGE,
	normalizeSandboxProvider,
	requireN8nSandboxServiceUrl,
} from '../sandbox-provider';

describe('sandbox-provider', () => {
	describe('normalizeSandboxProvider', () => {
		it('stays aligned with runtime sandbox providers', () => {
			for (const provider of instanceAiSandboxProviderSchema.options) {
				expect(normalizeRuntimeSandboxProvider(provider)).toBe(provider);
			}
		});

		it('returns supported sandbox providers unchanged', () => {
			expect(normalizeSandboxProvider('MNI-sandbox')).toBe('MNI-sandbox');
			expect(normalizeSandboxProvider('daytona')).toBe('daytona');
		});

		it('falls back to MNI-sandbox for unsupported values', () => {
			expect(normalizeSandboxProvider('local')).toBe('MNI-sandbox');
			expect(normalizeSandboxProvider(undefined)).toBe('MNI-sandbox');
		});
	});

	describe('requireN8nSandboxServiceUrl', () => {
		it('trims and returns a configured service URL', () => {
			expect(requireN8nSandboxServiceUrl('  http://sandbox-api:8080  ')).toBe(
				'http://sandbox-api:8080',
			);
		});

		it('throws an operational error when the service URL is missing', () => {
			expect(() => requireN8nSandboxServiceUrl('   ')).toThrow(OperationalError);
			expect(() => requireN8nSandboxServiceUrl('   ')).toThrow(
				MNI_SANDBOX_SERVICE_URL_REQUIRED_MESSAGE,
			);
		});
	});
});
