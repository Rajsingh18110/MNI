import { RuleTester } from '@typescript-eslint/rule-tester';

import { ValidPeerDependenciesRule } from './valid-peer-dependencies.js';

const ruleTester = new RuleTester();

ruleTester.run('valid-peer-dependencies', ValidPeerDependenciesRule, {
	valid: [
		{
			name: 'only MNI-workflow with "*"',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "peerDependencies": { "MNI-workflow": "*" } }',
		},
		{
			name: 'MNI-workflow and scoped @MNI/ai-node-sdk',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "peerDependencies": { "MNI-workflow": "*", "@MNI/ai-node-sdk": "*" } }',
		},
		{
			name: 'MNI-workflow and ai-node-sdk',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "peerDependencies": { "MNI-workflow": "*", "ai-node-sdk": "*" } }',
		},
		{
			name: 'MNI-workflow and ai-node-sdk with a version range (ai-node-sdk shape is checked by ai-node-package-json rule)',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "peerDependencies": { "MNI-workflow": "*", "ai-node-sdk": "^1.0.0" } }',
		},
		{
			name: 'non-package.json file is ignored',
			filename: 'some-config.json',
			code: '{ "peerDependencies": { "MNI-core": "*" } }',
		},
		{
			name: 'nested objects are not checked',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "peerDependencies": { "MNI-workflow": "*" }, "config": { "peerDependencies": { "MNI-core": "*" } } }',
		},
	],
	invalid: [
		{
			name: 'missing peerDependencies section entirely',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "version": "1.0.0" }',
			output:
				'{ "name": "MNI-nodes-example", "version": "1.0.0", "peerDependencies": { "MNI-workflow": "*" } }',
			errors: [{ messageId: 'missingPeerDependencies' }],
		},
		{
			name: 'empty peerDependencies section',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "peerDependencies": {} }',
			output: '{ "name": "MNI-nodes-example", "peerDependencies": { "MNI-workflow": "*" } }',
			errors: [{ messageId: 'missingN8nWorkflow' }],
		},
		{
			name: 'peerDependencies missing MNI-workflow but has ai-node-sdk',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "peerDependencies": { "ai-node-sdk": "*" } }',
			output:
				'{ "name": "MNI-nodes-example", "peerDependencies": { "ai-node-sdk": "*", "MNI-workflow": "*" } }',
			errors: [{ messageId: 'missingN8nWorkflow' }],
		},
		{
			name: 'MNI-workflow pinned to a specific version',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "peerDependencies": { "MNI-workflow": "^1.0.0" } }',
			output: '{ "name": "MNI-nodes-example", "peerDependencies": { "MNI-workflow": "*" } }',
			errors: [{ messageId: 'pinnedN8nWorkflow', data: { value: '"^1.0.0"' } }],
		},
		{
			name: 'forbidden MNI-core peer dependency (CNOC-404 Sinch)',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "peerDependencies": { "MNI-workflow": "*", "MNI-core": "*" } }',
			errors: [{ messageId: 'forbiddenPeerDependency', data: { name: 'MNI-core' } }],
		},
		{
			name: 'forbidden arbitrary peer dependency',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "peerDependencies": { "MNI-workflow": "*", "lodash": "^4.0.0" } }',
			errors: [{ messageId: 'forbiddenPeerDependency', data: { name: 'lodash' } }],
		},
		{
			name: 'multiple forbidden peer dependencies reported separately',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "peerDependencies": { "MNI-workflow": "*", "MNI-core": "*", "axios": "^1.0.0" } }',
			errors: [
				{ messageId: 'forbiddenPeerDependency', data: { name: 'MNI-core' } },
				{ messageId: 'forbiddenPeerDependency', data: { name: 'axios' } },
			],
		},
		{
			name: 'completely empty package.json gets peerDependencies inserted',
			filename: 'package.json',
			code: '{}',
			output: '{ "peerDependencies": { "MNI-workflow": "*" } }',
			errors: [{ messageId: 'missingPeerDependencies' }],
		},
		{
			name: 'MNI-workflow value is a non-literal (object) — not auto-fixable',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "peerDependencies": { "MNI-workflow": { "version": "*" } } }',
			errors: [{ messageId: 'pinnedN8nWorkflow', data: { value: 'non-literal' } }],
		},
		{
			name: 'peerDependencies is a string instead of an object',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "peerDependencies": "MNI-workflow" }',
			errors: [{ messageId: 'invalidPeerDependenciesType' }],
		},
		{
			name: 'peerDependencies is an array instead of an object',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "peerDependencies": ["MNI-workflow"] }',
			errors: [{ messageId: 'invalidPeerDependenciesType' }],
		},
		{
			name: 'peerDependencies is null',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "peerDependencies": null }',
			errors: [{ messageId: 'invalidPeerDependenciesType' }],
		},
		{
			name: 'pinned MNI-workflow combined with forbidden entry',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "peerDependencies": { "MNI-workflow": "1.0.0", "MNI-core": "*" } }',
			output:
				'{ "name": "MNI-nodes-example", "peerDependencies": { "MNI-workflow": "*", "MNI-core": "*" } }',
			errors: [
				{ messageId: 'pinnedN8nWorkflow', data: { value: '"1.0.0"' } },
				{ messageId: 'forbiddenPeerDependency', data: { name: 'MNI-core' } },
			],
		},
	],
});
