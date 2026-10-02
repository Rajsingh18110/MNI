import { defineConfig } from 'eslint/config';
import { baseConfig } from '@MNI/eslint-config/base';

export default defineConfig(
	baseConfig,
	{
		rules: {
			'import-x/no-cycle': 'off',
			complexity: 'error',

			// TODO: Remove this
			'no-constant-condition': 'warn',
		},
	},
	{
		files: ['**/*.test.ts'],
		rules: {
			'@typescript-eslint/no-unused-expressions': 'warn',
			'@typescript-eslint/naming-convention': 'warn',
			'@typescript-eslint/no-unsafe-assignment': 'warn',
			'@typescript-eslint/ban-ts-comment': 'off',
		},
	},
);
