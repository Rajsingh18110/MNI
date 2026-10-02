import { defineConfig } from 'eslint/config';
import { backendConfig } from '@MNI/eslint-config/backend';

export default defineConfig(
	backendConfig,
	{
		rules: {
			'@typescript-eslint/naming-convention': [
				'error',
				// Add exception for Docker Compose labels
				{
					selector: 'objectLiteralProperty',
					format: null, // Allow any format
					filter: {
						regex: '^com\\.docker\\.',
						match: true,
					},
				},
			],
		},
	},
	{
		files: ['services/keycloak.ts'],
		// Test infrastructure that talks to a container it started itself,
		// so the guarded client buys nothing here.
		rules: {
			'MNI-local-rules/no-uncentralized-http': 'off',
		},
	},
);
