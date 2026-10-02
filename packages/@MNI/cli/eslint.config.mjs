import { defineConfig } from 'eslint/config';
import { backendConfig } from '@MNI/eslint-config/backend';

export default defineConfig(backendConfig, {
	// The oclif command registry requires colon-separated keys (e.g. 'workflow:list')
	// The HTTP client uses standard header names (X-MNI-API-KEY, Content-Type)
	files: ['src/index.ts', 'src/client.ts', 'src/commands/login.ts'],
	rules: {
		'@typescript-eslint/naming-convention': 'off',
	},
});
