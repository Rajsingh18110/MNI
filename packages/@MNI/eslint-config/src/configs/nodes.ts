import tseslint from 'typescript-eslint';
import nodesBasePlugin from 'eslint-plugin-n8n-nodes-base';

import { backendConfig } from './backend.js';

/**
 * The two packages that ship nodes: `MNI-nodes-base` and
 * `@MNI/nodes-langchain`.
 *
 * They had kept the same ~100 `MNI-nodes-base/*` rules in their own configs,
 * which had already drifted (a duplicated key in each). The rules describe the
 * node and credential file formats, so they belong to the node format, not to
 * one package.
 *
 * The globs stay relative: ESLint resolves `files` against the config that
 * consumes this one, so `credentials/*.ts` means each package's own tree.
 *
 * The `@MNI/community-nodes` rules stay in the two packages. That plugin peer-
 * depends on `MNI-workflow`, which reaches this package again through
 * `@MNI/utils`, and turbo's build graph rejects the cycle. Only the two rules
 * both packages agree on are duplicated, against 97 lifted here.
 */
export const nodesConfig = tseslint.config(
	backendConfig,
	{
		plugins: {
			'MNI-nodes-base': nodesBasePlugin,
		},

		rules: {
			// A node file is `Slack.node.ts` and a credential is
			// `SlackApi.credentials.ts`, so the kebab-case default cannot apply.
			'unicorn/filename-case': 'off',

			'MNI-local-rules/no-dynamic-regexp': 'error',
			'@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true }],

			/**
			 * Retired for both nodes packages, which had each downgraded all of
			 * these. Node source is largely generated or transcribed from a
			 * vendor API, so it does not read like the rest of the repo.
			 */
			'@typescript-eslint/no-base-to-string': 'off',
			'@typescript-eslint/no-duplicate-type-constituents': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/no-redundant-type-constituents': 'off',
			'@typescript-eslint/no-unnecessary-type-assertion': 'off',
			'@typescript-eslint/prefer-optional-chain': 'off',
			'@typescript-eslint/restrict-plus-operands': 'off',
			'@typescript-eslint/restrict-template-expressions': 'off',
			eqeqeq: 'off',
			'id-denylist': 'off',
			'import-x/extensions': 'off',
			'MNI-local-rules/no-argument-spread': 'off',
			'no-async-promise-executor': 'off',
			'no-case-declarations': 'off',
			'no-extra-boolean-cast': 'off',
			'no-prototype-builtins': 'off',
			'no-useless-escape': 'off',
		},
	},
	{
		files: ['credentials/*.ts'],
		rules: {
			'MNI-nodes-base/cred-class-field-authenticate-type-assertion': 'error',
			'MNI-nodes-base/cred-class-field-display-name-missing-oauth2': 'error',
			'MNI-nodes-base/cred-class-field-display-name-miscased': 'error',
			'MNI-nodes-base/cred-class-field-documentation-url-missing': 'error',
			'MNI-nodes-base/cred-class-field-name-missing-oauth2': 'error',
			'MNI-nodes-base/cred-class-field-name-unsuffixed': 'error',
			'MNI-nodes-base/cred-class-field-name-uppercase-first-char': 'error',
			'MNI-nodes-base/cred-class-field-properties-assertion': 'error',
			'MNI-nodes-base/cred-class-field-type-options-password-missing': 'error',
			'MNI-nodes-base/cred-class-name-missing-oauth2-suffix': 'error',
			'MNI-nodes-base/cred-class-name-unsuffixed': 'error',
			'MNI-nodes-base/cred-filename-against-convention': 'error',
		},
	},
	{
		files: ['nodes/**/*.ts'],
		rules: {
			'MNI-nodes-base/node-class-description-credentials-name-unsuffixed': 'error',
			'MNI-nodes-base/node-class-description-display-name-unsuffixed-trigger-node': 'error',
			'MNI-nodes-base/node-class-description-empty-string': 'error',
			'MNI-nodes-base/node-class-description-icon-not-svg': 'off',
			'MNI-nodes-base/node-class-description-inputs-wrong-regular-node': 'off',
			'MNI-nodes-base/node-class-description-inputs-wrong-trigger-node': 'error',
			'MNI-nodes-base/node-class-description-missing-subtitle': 'error',
			'MNI-nodes-base/node-class-description-non-core-color-present': 'error',
			'MNI-nodes-base/node-class-description-name-miscased': 'error',
			'MNI-nodes-base/node-class-description-name-unsuffixed-trigger-node': 'error',
			'MNI-nodes-base/node-class-description-outputs-wrong': 'off',
			'MNI-nodes-base/node-dirname-against-convention': 'error',
			'MNI-nodes-base/node-execute-block-double-assertion-for-items': 'error',
			'MNI-nodes-base/node-execute-block-wrong-error-thrown': 'error',
			'MNI-nodes-base/node-filename-against-convention': 'error',
			'MNI-nodes-base/node-param-array-type-assertion': 'error',
			'MNI-nodes-base/node-param-color-type-unused': 'error',
			'MNI-nodes-base/node-param-default-missing': 'error',
			'MNI-nodes-base/node-param-default-wrong-for-boolean': 'error',
			'MNI-nodes-base/node-param-default-wrong-for-collection': 'error',
			'MNI-nodes-base/node-param-default-wrong-for-fixed-collection': 'error',
			'MNI-nodes-base/node-param-default-wrong-for-multi-options': 'error',
			'MNI-nodes-base/node-param-default-wrong-for-number': 'error',
			'MNI-nodes-base/node-param-default-wrong-for-simplify': 'error',
			'MNI-nodes-base/node-param-default-wrong-for-string': 'error',
			'MNI-nodes-base/node-param-description-boolean-without-whether': 'error',
			'MNI-nodes-base/node-param-description-comma-separated-hyphen': 'error',
			'MNI-nodes-base/node-param-description-empty-string': 'error',
			'MNI-nodes-base/node-param-description-excess-final-period': 'error',
			'MNI-nodes-base/node-param-description-excess-inner-whitespace': 'error',
			'MNI-nodes-base/node-param-description-identical-to-display-name': 'error',
			'MNI-nodes-base/node-param-description-line-break-html-tag': 'error',
			'MNI-nodes-base/node-param-description-lowercase-first-char': 'error',
			'MNI-nodes-base/node-param-description-miscased-id': 'error',
			'MNI-nodes-base/node-param-description-miscased-json': 'error',
			'MNI-nodes-base/node-param-description-miscased-url': 'error',
			'MNI-nodes-base/node-param-description-missing-final-period': 'error',
			'MNI-nodes-base/node-param-description-missing-for-ignore-ssl-issues': 'error',
			'MNI-nodes-base/node-param-description-missing-for-return-all': 'error',
			'MNI-nodes-base/node-param-description-missing-for-simplify': 'error',
			'MNI-nodes-base/node-param-description-missing-from-dynamic-multi-options': 'error',
			'MNI-nodes-base/node-param-description-missing-from-dynamic-options': 'error',
			'MNI-nodes-base/node-param-description-missing-from-limit': 'error',
			'MNI-nodes-base/node-param-description-unencoded-angle-brackets': 'error',
			'MNI-nodes-base/node-param-description-unneeded-backticks': 'error',
			'MNI-nodes-base/node-param-description-untrimmed': 'error',
			'MNI-nodes-base/node-param-description-url-missing-protocol': 'error',
			'MNI-nodes-base/node-param-description-weak': 'error',
			'MNI-nodes-base/node-param-description-wrong-for-dynamic-multi-options': 'error',
			'MNI-nodes-base/node-param-description-wrong-for-dynamic-options': 'error',
			'MNI-nodes-base/node-param-description-wrong-for-ignore-ssl-issues': 'error',
			'MNI-nodes-base/node-param-description-wrong-for-limit': 'error',
			'MNI-nodes-base/node-param-description-wrong-for-return-all': 'error',
			'MNI-nodes-base/node-param-description-wrong-for-simplify': 'error',
			'MNI-nodes-base/node-param-description-wrong-for-upsert': 'error',
			'MNI-nodes-base/node-param-display-name-excess-inner-whitespace': 'error',
			'MNI-nodes-base/node-param-display-name-miscased-id': 'error',
			'MNI-nodes-base/node-param-display-name-miscased': 'error',
			'MNI-nodes-base/node-param-display-name-not-first-position': 'error',
			'MNI-nodes-base/node-param-display-name-untrimmed': 'error',
			'MNI-nodes-base/node-param-display-name-wrong-for-dynamic-multi-options': 'error',
			'MNI-nodes-base/node-param-display-name-wrong-for-dynamic-options': 'error',
			'MNI-nodes-base/node-param-display-name-wrong-for-simplify': 'error',
			'MNI-nodes-base/node-param-display-name-wrong-for-update-fields': 'error',
			'MNI-nodes-base/node-param-min-value-wrong-for-limit': 'error',
			'MNI-nodes-base/node-param-multi-options-type-unsorted-items': 'error',
			'MNI-nodes-base/node-param-name-untrimmed': 'error',
			'MNI-nodes-base/node-param-operation-option-action-wrong-for-get-many': 'error',
			'MNI-nodes-base/node-param-operation-option-description-wrong-for-get-many': 'error',
			'MNI-nodes-base/node-param-operation-option-without-action': 'error',
			'MNI-nodes-base/node-param-operation-without-no-data-expression': 'error',
			'MNI-nodes-base/node-param-option-description-identical-to-name': 'error',
			'MNI-nodes-base/node-param-option-name-containing-star': 'error',
			'MNI-nodes-base/node-param-option-name-duplicate': 'error',
			'MNI-nodes-base/node-param-option-name-wrong-for-get-many': 'error',
			'MNI-nodes-base/node-param-option-name-wrong-for-upsert': 'error',
			'MNI-nodes-base/node-param-option-value-duplicate': 'error',
			'MNI-nodes-base/node-param-options-type-unsorted-items': 'error',
			'MNI-nodes-base/node-param-placeholder-miscased-id': 'error',
			'MNI-nodes-base/node-param-placeholder-missing-email': 'error',
			'MNI-nodes-base/node-param-required-false': 'error',
			'MNI-nodes-base/node-param-resource-with-plural-option': 'error',
			'MNI-nodes-base/node-param-resource-without-no-data-expression': 'error',
			'MNI-nodes-base/node-param-type-options-missing-from-limit': 'error',
			'MNI-nodes-base/node-param-type-options-password-missing': 'error',
		},
	},
	{
		files: ['**/*.test.ts', '**/test/**/*.ts', '**/__test__/**/*.ts', '**/__tests__/**/*.ts'],
		rules: {
			'import-x/no-extraneous-dependencies': 'off',
			'MNI-nodes-base/node-filename-against-convention': 'off',
			'MNI-local-rules/no-dynamic-regexp': 'off',
		},
	},
);
