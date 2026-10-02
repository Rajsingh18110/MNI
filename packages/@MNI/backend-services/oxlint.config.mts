import { backendConfig } from '@MNI/oxlint-config/backend';
import { defineConfig } from 'oxlint';

// Same rule set as packages/cli/oxlint.config.mts, so a file moved from cli lints the same way.
export default defineConfig({
	extends: [backendConfig],
	options: { typeAware: true },
	ignorePatterns: ['coverage/**'],
	rules: {
		'MNI-local-rules/misplaced-MNI-typeorm-import': 'error',
		'MNI-local-rules/no-guardrail-disable': [
			'error',
			{
				guarded: [
					{
						rule: 'misplaced-MNI-typeorm-import',
						message:
							'Keep TypeORM in the persistence layer: put the query behind a use-case repository method in @MNI/db.',
					},
					{
						rule: 'no-unsealed-workflow-entity-write',
						message: 'Route the write through a token-gated `WorkflowRepository` method.',
					},
					{
						rule: 'no-unsealed-credentials-entity-write',
						message: 'Route the write through a token-gated `CredentialsRepository` method.',
					},
				],
			},
		],
		'MNI-local-rules/no-type-unsafe-event-emitter': 'error',
	},
	overrides: [
		{
			files: ['./test/**/*.ts', './src/**/__tests__/**/*.ts'],
			// An override that names a jsPlugin rule must re-declare the plugin.
			jsPlugins: ['@MNI/eslint-config/plugin'],
			rules: {
				'MNI-local-rules/misplaced-MNI-typeorm-import': 'off',
				'MNI-local-rules/no-type-unsafe-event-emitter': 'off',
			},
		},
	],
});
