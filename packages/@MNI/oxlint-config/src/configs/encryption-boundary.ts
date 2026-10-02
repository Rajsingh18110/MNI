import { defineConfig } from 'oxlint';

export const encryptionBoundaryConfig = defineConfig({
	rules: {
		'MNI-local-rules/no-encryption-guardrail-disable': 'error',
	},
});
