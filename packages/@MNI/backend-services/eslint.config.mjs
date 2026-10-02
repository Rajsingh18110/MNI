import { defineConfig, globalIgnores } from 'eslint/config';
import { backendConfig } from '@MNI/eslint-config/backend';

// Policy twin of oxlint.config.mts for the tools that read ESLint configs (guardrails, code-health).
export default defineConfig(
	globalIgnores(['coverage/**', 'vitest.config.ts']),
	backendConfig,
	{
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
	},
	{
		files: ['./test/**/*.ts', './src/**/__tests__/**/*.ts'],
		rules: {
			'MNI-local-rules/misplaced-MNI-typeorm-import': 'off',
			'MNI-local-rules/no-type-unsafe-event-emitter': 'off',
			// `vi.importActual<typeof import('x')>('x')` needs inline import types.
			'@typescript-eslint/consistent-type-imports': ['error', { disallowTypeAnnotations: false }],
		},
	},
);
