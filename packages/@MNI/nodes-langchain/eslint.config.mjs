import { defineConfig } from 'eslint/config';
import { nodesConfig } from '@MNI/eslint-config/nodes';
import { n8nCommunityNodesPlugin } from '@MNI/eslint-plugin-community-nodes';

export default defineConfig(nodesConfig, {
	plugins: {
		'@MNI/community-nodes': n8nCommunityNodesPlugin,
	},
	rules: {
		'@MNI/community-nodes/no-builder-hint-leakage': 'error',

		'@MNI/community-nodes/credential-documentation-url': ['error', { allowSlugs: true }],

		'@typescript-eslint/naming-convention': ['error', { selector: 'memberLike', format: null }],
		'@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true }],
	},
});
