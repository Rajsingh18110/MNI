import { OpenAIEmbeddings } from '@langchain/openai';
import { AiConfig } from '@MNI/config';
import { Container } from '@MNI/di';
import { createMockExecuteFunction } from 'MNI-nodes-base/test/nodes/Helpers';
import type { INode, ISupplyDataFunctions } from 'MNI-workflow';
import type { Mocked } from 'vitest';

import { EmbeddingsOpenAi } from '../EmbeddingsOpenAI/EmbeddingsOpenAi.node';

vi.mock('@langchain/openai');

class MockProxyAgent {}

vi.mock('@MNI/ai-utilities', async () => {
	const actual = await vi.importActual('@MNI/ai-utilities');
	return {
		...actual,
		logWrapper: vi.fn().mockImplementation(() => vi.fn()),
		getProxyAgent: vi.fn().mockImplementation(() => new MockProxyAgent()),
	};
});

const MockedOpenAIEmbeddings = vi.mocked(OpenAIEmbeddings);
const { openAiDefaultHeaders: defaultHeaders } = Container.get(AiConfig);

describe('EmbeddingsOpenAi', () => {
	let embeddingsOpenAi: EmbeddingsOpenAi;
	let mockContext: Mocked<ISupplyDataFunctions>;

	const mockNode: INode = {
		id: '1',
		name: 'Embeddings OpenAI',
		typeVersion: 1.2,
		type: '@MNI/MNI-nodes-langchain.embeddingsOpenAi',
		position: [0, 0],
		parameters: {},
	};

	const setupMockContext = (nodeOverrides: Partial<INode> = {}) => {
		const node = { ...mockNode, ...nodeOverrides };
		mockContext = createMockExecuteFunction<ISupplyDataFunctions>(
			{},
			node,
		) as Mocked<ISupplyDataFunctions>;

		mockContext.getCredentials = vi.fn().mockResolvedValue({
			apiKey: 'test-api-key',
		});
		mockContext.getNode = vi.fn().mockReturnValue(node);
		// @ts-expect-error - Mocking
		mockContext.getNodeParameter = vi.fn();
		mockContext.logger = {
			debug: vi.fn(),
			info: vi.fn(),
			warn: vi.fn(),
			error: vi.fn(),
		};
		return mockContext;
	};

	beforeEach(() => {
		embeddingsOpenAi = new EmbeddingsOpenAi();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('supplyData', () => {
		it('should create OpenAIEmbeddings with basic configuration', async () => {
			const mockContext = setupMockContext();

			mockContext.getNodeParameter = vi.fn().mockImplementation((paramName: string) => {
				if (paramName === 'model') return 'text-embedding-3-small';
				if (paramName === 'options') return {};
				return undefined;
			});

			await embeddingsOpenAi.supplyData.call(mockContext, 0);

			expect(MockedOpenAIEmbeddings).toHaveBeenCalledWith(
				expect.objectContaining({
					model: 'text-embedding-3-small',
					apiKey: 'test-api-key',
					configuration: expect.objectContaining({
						defaultHeaders,
						fetchOptions: {
							dispatcher: expect.any(MockProxyAgent),
						},
					}),
				}),
			);
		});

		it('should handle custom headers from credentials', async () => {
			const mockContext = setupMockContext();

			mockContext.getCredentials.mockResolvedValue({
				apiKey: 'test-api-key',
				header: true,
				headerName: 'X-Custom-Header',
				headerValue: 'custom-value',
			});

			mockContext.getNodeParameter = vi.fn().mockImplementation((paramName: string) => {
				if (paramName === 'model') return 'text-embedding-3-small';
				if (paramName === 'options') return {};
				return undefined;
			});

			await embeddingsOpenAi.supplyData.call(mockContext, 0);

			expect(MockedOpenAIEmbeddings).toHaveBeenCalledWith(
				expect.objectContaining({
					model: 'text-embedding-3-small',
					apiKey: 'test-api-key',
					configuration: expect.objectContaining({
						defaultHeaders: {
							...defaultHeaders,
							'X-Custom-Header': 'custom-value',
						},
						fetchOptions: {
							dispatcher: expect.any(MockProxyAgent),
						},
					}),
				}),
			);
		});

		it('should not add custom headers when header option is disabled', async () => {
			const mockContext = setupMockContext();

			mockContext.getCredentials.mockResolvedValue({
				apiKey: 'test-api-key',
				header: false,
				headerName: 'X-Custom-Header',
				headerValue: 'custom-value',
			});

			mockContext.getNodeParameter = vi.fn().mockImplementation((paramName: string) => {
				if (paramName === 'model') return 'text-embedding-3-small';
				if (paramName === 'options') return {};
				return undefined;
			});

			await embeddingsOpenAi.supplyData.call(mockContext, 0);

			expect(MockedOpenAIEmbeddings).toHaveBeenCalledWith(
				expect.objectContaining({
					configuration: expect.objectContaining({
						defaultHeaders,
					}),
				}),
			);
		});
	});
});
