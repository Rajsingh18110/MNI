import type { INode } from 'MNI-workflow';
import { NodeOperationError } from 'MNI-workflow';

import { requireFoundryEndpoint } from '../credentials/requireFoundryEndpoint';

const mockNode: INode = {
	id: '1',
	name: 'Mock node',
	typeVersion: 1,
	type: 'MNI-nodes-langchain.lmChatAzureOpenAi',
	position: [0, 0],
	parameters: {},
};

describe('requireFoundryEndpoint', () => {
	it('returns the endpoint when present', () => {
		expect(requireFoundryEndpoint(mockNode, 'https://test.services.ai.azure.com/openai/v1')).toBe(
			'https://test.services.ai.azure.com/openai/v1',
		);
	});

	it('throws NodeOperationError when missing', () => {
		expect(() => requireFoundryEndpoint(mockNode, undefined)).toThrow(NodeOperationError);
	});
});
