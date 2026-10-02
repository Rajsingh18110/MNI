import { RuleTester } from '@typescript-eslint/rule-tester';

import { PackageNameConventionRule } from './package-name-convention.js';

const ruleTester = new RuleTester();

ruleTester.run('package-name-convention', PackageNameConventionRule, {
	valid: [
		{
			name: 'valid unscoped package name',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "version": "1.0.0" }',
		},
		{
			name: 'valid unscoped package name with dashes',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-my-service", "version": "1.0.0" }',
		},
		{
			name: 'valid scoped package name',
			filename: 'package.json',
			code: '{ "name": "@mycompany/MNI-nodes-example", "version": "1.0.0" }',
		},
		{
			name: 'valid scoped package name with dashes',
			filename: 'package.json',
			code: '{ "name": "@author/MNI-nodes-service", "version": "1.0.0" }',
		},
		{
			name: 'non-package.json file ignored',
			filename: 'some-config.json',
			code: '{ "name": "my-config", "type": "config" }',
		},
		{
			name: 'nested name fields should be ignored - only top-level name matters',
			filename: 'package.json',
			code: `{
				"name": "MNI-nodes-example",
				"version": "1.0.0",
				"dependencies": {
					"name": "invalid-nested-name"
				},
				"scripts": {
					"name": "another-invalid-name"
				},
				"author": {
					"name": "John Doe"
				}
			}`,
		},
		{
			name: 'deeply nested name fields should be ignored',
			filename: 'package.json',
			code: `{
				"name": "@author/MNI-nodes-service",
				"version": "1.0.0",
				"config": {
					"nested": {
						"deeply": {
							"name": "very-invalid-name"
						}
					}
				},
				"repository": {
					"type": "git",
					"url": "https://github.com/user/repo",
					"directory": {
						"name": "bad-name"
					}
				}
			}`,
		},
	],
	invalid: [
		{
			name: 'invalid package name - generic',
			filename: 'package.json',
			code: '{ "name": "my-package", "version": "1.0.0" }',
			errors: [
				{
					messageId: 'invalidPackageName',
					data: { packageName: 'my-package' },
					suggestions: [
						{
							messageId: 'renameTo',
							data: { suggestedName: 'MNI-nodes-my-package' },
							output: '{ "name": "MNI-nodes-my-package", "version": "1.0.0" }',
						},
					],
				},
			],
		},
		{
			name: 'invalid package name - missing nodes',
			filename: 'package.json',
			code: '{ "name": "MNI-example", "version": "1.0.0" }',
			errors: [
				{
					messageId: 'invalidPackageName',
					data: { packageName: 'MNI-example' },
					suggestions: [
						{
							messageId: 'renameTo',
							data: { suggestedName: 'MNI-nodes-example' },
							output: '{ "name": "MNI-nodes-example", "version": "1.0.0" }',
						},
					],
				},
			],
		},
		{
			name: 'invalid scoped package name',
			filename: 'package.json',
			code: '{ "name": "@company/example-nodes", "version": "1.0.0" }',
			errors: [
				{
					messageId: 'invalidPackageName',
					data: { packageName: '@company/example-nodes' },
					suggestions: [
						{
							messageId: 'renameTo',
							data: { suggestedName: '@company/MNI-nodes-example' },
							output: '{ "name": "@company/MNI-nodes-example", "version": "1.0.0" }',
						},
					],
				},
			],
		},
		{
			name: 'invalid package name - wrong order',
			filename: 'package.json',
			code: '{ "name": "nodes-MNI-example", "version": "1.0.0" }',
			errors: [
				{
					messageId: 'invalidPackageName',
					data: { packageName: 'nodes-MNI-example' },
					suggestions: [
						{
							messageId: 'renameTo',
							data: { suggestedName: 'MNI-nodes-example' },
							output: '{ "name": "MNI-nodes-example", "version": "1.0.0" }',
						},
					],
				},
			],
		},
		{
			name: 'empty package name',
			filename: 'package.json',
			code: '{ "name": "", "version": "1.0.0" }',
			errors: [
				{
					messageId: 'invalidPackageName',
					data: { packageName: '' },
					suggestions: [],
				},
			],
		},
		{
			name: 'incomplete package name with missing suffix',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-", "version": "1.0.0" }',
			errors: [
				{
					messageId: 'invalidPackageName',
					data: { packageName: 'MNI-nodes-' },
					suggestions: [],
				},
			],
		},
		{
			name: 'incomplete scoped package name with missing suffix',
			filename: 'package.json',
			code: '{ "name": "@company/MNI-nodes-", "version": "1.0.0" }',
			errors: [
				{
					messageId: 'invalidPackageName',
					data: { packageName: '@company/MNI-nodes-' },
					suggestions: [],
				},
			],
		},
		{
			name: 'missing name property',
			filename: 'package.json',
			code: '{ "version": "1.0.0", "description": "test" }',
			errors: [
				{
					messageId: 'missingName',
				},
			],
		},
		{
			name: 'default placeholder name',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-<...>", "version": "1.0.0" }',
			errors: [
				{
					messageId: 'defaultPlaceholderName',
					data: { packageName: 'MNI-nodes-<...>' },
				},
			],
		},
		{
			name: 'name containing default placeholder',
			filename: 'package.json',
			code: '{ "name": "@company/MNI-nodes-<...>", "version": "1.0.0" }',
			errors: [
				{
					messageId: 'defaultPlaceholderName',
					data: { packageName: '@company/MNI-nodes-<...>' },
				},
			],
		},
	],
});
