import { defineConfig } from 'oxlint';

export const backendNetworkBoundaryConfig = defineConfig({
	rules: {
		'MNI-local-rules/no-uncentralized-http': [
			'error',
			{
				allow: ['packages/@MNI/backend-network/', 'packages/@MNI/benchmark/'],
			},
		],
	},
});
