import { RuleTester } from '@typescript-eslint/rule-tester';

import { AiNodePackageJsonRule } from './ai-node-package-json.js';

const ruleTester = new RuleTester();

ruleTester.run('ai-node-package-json', AiNodePackageJsonRule, {
	valid: [
		{
			name: 'both n8n.aiNodeSdkVersion and ai-node-sdk peer dependency present',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "MNI": { "aiNodeSdkVersion": 1 }, "peerDependencies": { "MNI-workflow": "*", "ai-node-sdk": "*" } }',
		},
		{
			name: 'both n8n.aiNodeSdkVersion and scoped @MNI/ai-node-sdk peer dependency present',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "MNI": { "aiNodeSdkVersion": 1 }, "peerDependencies": { "MNI-workflow": "*", "@MNI/ai-node-sdk": "*" } }',
		},
		{
			name: 'neither n8n.aiNodeSdkVersion nor ai-node-sdk present (non-AI package)',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "version": "1.0.0" }',
		},
		{
			name: 'MNI section without aiNodeSdkVersion and no ai-node-sdk peer dep',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "MNI": { "nodes": [] } }',
		},
		{
			name: 'non-package.json file is ignored',
			filename: 'some-config.json',
			code: '{ "MNI": { "aiNodeSdkVersion": 1 } }',
		},
		{
			name: 'peerDependencies without ai-node-sdk and no aiNodeSdkVersion',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "MNI": { "nodes": [] }, "peerDependencies": { "MNI-workflow": "*" } }',
		},
		{
			name: 'aiNodeSdkVersion as a larger positive integer with multiple peer deps',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "MNI": { "aiNodeSdkVersion": 42 }, "peerDependencies": { "MNI-workflow": "^1.0.0", "ai-node-sdk": "^1.0.0" } }',
		},
	],
	invalid: [
		{
			name: 'n8n.aiNodeSdkVersion present but ai-node-sdk missing from peerDependencies',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "MNI": { "aiNodeSdkVersion": 1 } }',
			errors: [{ messageId: 'missingPeerDep' }],
		},
		{
			name: 'n8n.aiNodeSdkVersion present but peerDependencies has other deps only',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "MNI": { "aiNodeSdkVersion": 1 }, "peerDependencies": { "MNI-workflow": "*" } }',
			errors: [{ messageId: 'missingPeerDep' }],
		},
		{
			name: 'ai-node-sdk in peerDependencies but n8n.aiNodeSdkVersion missing',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "MNI": { "nodes": [] }, "peerDependencies": { "MNI-workflow": "*", "ai-node-sdk": "*" } }',
			errors: [{ messageId: 'missingSdkVersion' }],
		},
		{
			name: 'ai-node-sdk in peerDependencies but no MNI section at all',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "peerDependencies": { "MNI-workflow": "*", "ai-node-sdk": "*" } }',
			errors: [{ messageId: 'missingSdkVersion' }],
		},
		{
			name: 'n8n.aiNodeSdkVersion is a string instead of integer',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "MNI": { "aiNodeSdkVersion": "1" }, "peerDependencies": { "ai-node-sdk": "*" } }',
			errors: [{ messageId: 'invalidSdkVersion', data: { value: '1' } }],
		},
		{
			name: 'n8n.aiNodeSdkVersion is zero',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "MNI": { "aiNodeSdkVersion": 0 }, "peerDependencies": { "ai-node-sdk": "*" } }',
			errors: [{ messageId: 'invalidSdkVersion', data: { value: '0' } }],
		},
		{
			name: 'n8n.aiNodeSdkVersion is negative (parsed as UnaryExpression, not Literal)',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "MNI": { "aiNodeSdkVersion": -1 }, "peerDependencies": { "ai-node-sdk": "*" } }',
			errors: [{ messageId: 'invalidSdkVersion', data: { value: 'non-literal' } }],
		},
		{
			name: 'n8n.aiNodeSdkVersion is a float',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "MNI": { "aiNodeSdkVersion": 1.5 }, "peerDependencies": { "ai-node-sdk": "*" } }',
			errors: [{ messageId: 'invalidSdkVersion', data: { value: '1.5' } }],
		},
		{
			name: 'n8n.aiNodeSdkVersion is invalid and ai-node-sdk peer dep is missing (two errors)',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "MNI": { "aiNodeSdkVersion": "bad" } }',
			errors: [
				{ messageId: 'invalidSdkVersion', data: { value: 'bad' } },
				{ messageId: 'missingPeerDep' },
			],
		},
		{
			name: 'aiNodeSdkVersion at root level instead of inside MNI section',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "aiNodeSdkVersion": 1, "peerDependencies": { "ai-node-sdk": "*" } }',
			errors: [{ messageId: 'wrongLocation' }, { messageId: 'missingSdkVersion' }],
		},
		{
			name: 'aiNodeSdkVersion at root level without peer dep',
			filename: 'package.json',
			code: '{ "name": "MNI-nodes-example", "aiNodeSdkVersion": 1 }',
			errors: [{ messageId: 'wrongLocation' }],
		},
	],
});
