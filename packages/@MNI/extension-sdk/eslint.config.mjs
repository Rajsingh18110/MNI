import { defineConfig } from 'eslint/config';
import { baseConfig } from '@MNI/eslint-config/base';

export default defineConfig(baseConfig, {
	rules: {
		// TODO: Remove this
		'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'warn',
		'@typescript-eslint/no-floating-promises': 'warn',
	},
});
