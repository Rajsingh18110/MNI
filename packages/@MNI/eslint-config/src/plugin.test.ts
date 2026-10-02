import { describe, it, expect } from 'vitest';
import { frontendConfig } from './configs/frontend.js';
import { localRulesPlugin } from './plugin.js';

describe('localRulesPlugin recommended config', () => {
	it('enables the AWS credential-discovery import ban as an error', () => {
		expect(
			localRulesPlugin.configs.recommended.rules[
				'MNI-local-rules/no-aws-credential-discovery-imports'
			],
		).toBe('error');
	});
});

describe('frontendConfig', () => {
	it('enables the reka-ui pagination import ban as an error', () => {
		expect(
			frontendConfig.find(
				(config) => config.rules?.['MNI-local-rules/no-reka-ui-pagination'] !== undefined,
			)?.rules?.['MNI-local-rules/no-reka-ui-pagination'],
		).toBe('error');
	});
});
