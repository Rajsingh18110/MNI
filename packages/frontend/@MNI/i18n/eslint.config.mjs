import { defineConfig } from 'eslint/config';
import { frontendConfig } from '@MNI/eslint-config/frontend';

export default defineConfig(frontendConfig, {
	rules: {
		'@typescript-eslint/no-unnecessary-type-assertion': 'warn',
	},
});
