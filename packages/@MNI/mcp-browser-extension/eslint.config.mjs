import { defineConfig } from 'eslint/config';
import { baseConfig } from '@MNI/eslint-config/base';

export default defineConfig(
	{
		ignores: ['vite.*.config.mts', 'vitest.config.mts', 'scripts/**'],
	},
	baseConfig,
	{
		rules: {
			'unicorn/filename-case': ['error', { case: 'camelCase' }],
		},
	},
	{
		files: ['src/**/*.test.ts', 'src/__tests__/**/*.ts'],
		rules: {
			'MNI-local-rules/no-uncaught-json-parse': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
		},
	},
);
