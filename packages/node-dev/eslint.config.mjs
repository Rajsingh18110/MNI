import { defineConfig } from 'eslint/config';
import { backendConfig } from '@MNI/eslint-config/backend';

export default defineConfig(backendConfig, {
	rules: {
		// TODO: Remove this
		'unicorn/filename-case': 'warn',
	},
});
