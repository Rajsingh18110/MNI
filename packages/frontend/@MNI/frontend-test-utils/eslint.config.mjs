import { defineConfig } from 'eslint/config';
import { frontendConfig } from '@MNI/eslint-config/frontend';

export default defineConfig(frontendConfig, {
	rules: {
		// This package is L1: it sits beside `@MNI/design-system` and `@MNI/i18n`, below
		// `@MNI/stores` and `@MNI/composables`. A helper that reached up to L2 would make every
		// module package that renders a component depend on the store layer.
		//
		// The `paths` in `tsconfig.json` already omit these, which is the structural half of the
		// rule. This is the half that names the reason in the error.
		'no-restricted-imports': [
			'error',
			{
				patterns: [
					{
						// `**`, not `*`: minimatch's `*` never crosses a `/`, so `'@/*'` would miss
						// `@/app/...` — the shape a stray shell import actually takes.
						group: [
							'@MNI/stores',
							'@MNI/stores/**',
							'@MNI/composables',
							'@MNI/composables/**',
							'@MNI/frontend-module-*',
							'@MNI/frontend-module-*/**',
							'@/**',
						],
						message:
							'@MNI/frontend-test-utils is L1. It may import @MNI/api-types, @MNI/i18n and @MNI/design-system only. See the comment in eslint.config.mjs.',
					},
				],
			},
		],
	},
});
