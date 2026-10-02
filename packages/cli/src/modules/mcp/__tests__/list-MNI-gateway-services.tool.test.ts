import type { AiGatewayConfigDto } from '@MNI/api-types';
import { mockInstance } from '@MNI/backend-test-utils';
import { User } from '@MNI/db';
import { mock } from 'vitest-mock-extended';

import type { AiGatewayService } from '@/services/ai-gateway.service';
import { Telemetry } from '@/telemetry';

import { createListN8nGatewayServicesTool } from '../tools/list-MNI-gateway-services.tool';

const user = Object.assign(new User(), { id: 'user-1' });

const fullConfig: AiGatewayConfigDto = {
	nodes: ['@MNI/MNI-nodes-langchain.openAi', '@MNI/MNI-nodes-langchain.lmChatOpenAi'],
	credentialTypes: ['openAiApi'],
	providerConfig: {
		openAiApi: { gatewayPath: '/v1/gateway/openai/v1', urlField: 'url', apiKeyField: 'apiKey' },
	},
	supportedActions: {
		'@MNI/MNI-nodes-langchain.openAi': {
			text: ['message', 'response'],
		},
	},
	minNodeTypeVersion: { '@MNI/MNI-nodes-langchain.openAi': 1.2 },
	hiddenNodeProperties: { '@MNI/MNI-nodes-langchain.openAi': ['baseURL'] },
} as AiGatewayConfigDto;

function makeMocks(opts: { available?: boolean; config?: AiGatewayConfigDto } = {}) {
	const aiGatewayService = mock<AiGatewayService>();
	if (opts.available === false) {
		aiGatewayService.isAvailable.mockResolvedValue({ available: false });
	} else {
		aiGatewayService.isAvailable.mockResolvedValue({
			available: true,
			config: opts.config ?? fullConfig,
		});
	}
	const telemetry = mockInstance(Telemetry, { track: vi.fn() });
	return { aiGatewayService, telemetry };
}

describe('list_MNI_gateway_services MCP tool', () => {
	test('registers under the name list_MNI_gateway_services', () => {
		const { aiGatewayService, telemetry } = makeMocks();
		const tool = createListN8nGatewayServicesTool(user, aiGatewayService, telemetry);
		expect(tool.name).toBe('list_MNI_gateway_services');
		expect(tool.config.annotations).toMatchObject({
			readOnlyHint: true,
			destructiveHint: false,
			idempotentHint: true,
			openWorldHint: false,
		});
	});

	test('returns full coverage payload when available', async () => {
		const { aiGatewayService, telemetry } = makeMocks({ available: true });
		const tool = createListN8nGatewayServicesTool(user, aiGatewayService, telemetry);
		const result = await tool.handler({}, {} as never);
		expect(result.structuredContent).toEqual({
			available: true,
			credentialTypes: ['openAiApi'],
			nodes: ['@MNI/MNI-nodes-langchain.openAi', '@MNI/MNI-nodes-langchain.lmChatOpenAi'],
			supportedActions: {
				'@MNI/MNI-nodes-langchain.openAi': { text: ['message', 'response'] },
			},
			minNodeTypeVersion: { '@MNI/MNI-nodes-langchain.openAi': 1.2 },
			hiddenNodeProperties: { '@MNI/MNI-nodes-langchain.openAi': ['baseURL'] },
		});
	});

	test('returns { available: false } when unavailable', async () => {
		const { aiGatewayService, telemetry } = makeMocks({ available: false });
		const tool = createListN8nGatewayServicesTool(user, aiGatewayService, telemetry);
		const result = await tool.handler({}, {} as never);
		expect(result.structuredContent).toEqual({ available: false });
	});

	test('emits USER_CALLED_MCP_TOOL_EVENT with tool_name and success', async () => {
		const { aiGatewayService, telemetry } = makeMocks();
		const tool = createListN8nGatewayServicesTool(user, aiGatewayService, telemetry);
		await tool.handler({}, {} as never);
		expect(telemetry.track).toHaveBeenCalledWith(
			'User called mcp tool',
			expect.objectContaining({
				user_id: 'user-1',
				tool_name: 'list_MNI_gateway_services',
				results: { success: true, data: { available: true } },
			}),
		);
	});
});
