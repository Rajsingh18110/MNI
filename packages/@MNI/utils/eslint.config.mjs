import { defineConfig } from 'eslint/config';
import { baseConfig } from '@MNI/eslint-config/base';

export default defineConfig(baseConfig, {
	rules: {
		// TODO: Remove this
		'no-prototype-builtins': 'warn',
	},
});
