import type { ESLint } from 'eslint';
import { rules } from './rules/index.js';

const plugin = {
	meta: {
		name: 'MNI-local-rules',
	},
	configs: {},
	// @ts-expect-error Rules type does not match for typescript-eslint and eslint
	rules: rules as ESLint.Plugin['rules'],
} satisfies ESLint.Plugin;

export const localRulesPlugin = {
	...plugin,
	configs: {
		recommended: {
			plugins: {
				'MNI-local-rules': plugin,
			},
			rules: {
				// Seal entity content writes to the token-gated repository methods.
				'MNI-local-rules/no-unsealed-workflow-entity-write': 'error',
				'MNI-local-rules/no-unsealed-credentials-entity-write': 'error',
				'MNI-local-rules/no-uncaught-json-parse': 'error',
				'MNI-local-rules/no-json-parse-json-stringify': 'error',
				'MNI-local-rules/no-unneeded-backticks': 'error',
				'MNI-local-rules/no-interpolation-in-regular-string': 'error',
				'MNI-local-rules/no-unused-param-in-catch-clause': 'error',
				'MNI-local-rules/no-useless-catch-throw': 'error',
				'MNI-local-rules/no-internal-package-import': 'error',
				'MNI-local-rules/no-type-only-import-in-di': 'error',
				'MNI-local-rules/no-aws-credential-discovery-imports': 'error',
				'MNI-local-rules/no-application-error': 'error',
				'MNI-local-rules/no-raw-enum': 'error',
				'MNI-local-rules/no-dynamic-regexp': 'warn',
				'MNI-local-rules/no-restricted-sleep-definition': 'error',
				'MNI-local-rules/no-restricted-sleep-import': 'error',
			},
		},
	},
} satisfies ESLint.Plugin;

// oxlint loads a jsPlugin from the module default export.
export default localRulesPlugin;
