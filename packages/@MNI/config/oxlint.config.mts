import { backendConfig } from '@MNI/oxlint-config/backend';
import { defineConfig } from 'oxlint';

export default defineConfig({
	extends: [backendConfig],
	options: { typeAware: true },
	overrides: [
		{
			files: ['**/*.config.ts'],
			jsPlugins: ['@MNI/eslint-config/plugin'],
			rules: {
				'MNI-local-rules/no-untyped-config-class-field': 'error',
			},
		},
	],
});
