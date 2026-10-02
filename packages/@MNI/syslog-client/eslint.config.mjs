import { defineConfig } from 'eslint/config';
import { backendConfig } from '@MNI/eslint-config/backend';

export default defineConfig(backendConfig, {
	files: ['**/*.config.ts'],
	rules: {
		'MNI-local-rules/no-untyped-config-class-field': 'error',
	},
});
