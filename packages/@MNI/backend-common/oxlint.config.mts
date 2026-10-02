import { backendConfig } from '@MNI/oxlint-config/backend';
import { defineConfig } from 'oxlint';

export default defineConfig({
	extends: [backendConfig],
	options: { typeAware: true },
	overrides: [
		{
			files: ['**/*.test.ts'],
			jsPlugins: ['@MNI/eslint-config/plugin'],
			rules: {
				'MNI-local-rules/no-uncaught-json-parse': 'warn',
				'typescript/no-unsafe-return': 'warn',
				'typescript/no-unsafe-assignment': 'warn',
				'typescript/no-unsafe-argument': 'warn',
				'typescript/unbound-method': 'warn',
			},
		},
	],
});
