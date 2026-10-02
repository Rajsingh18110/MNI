import {
	chatHubLLMProviderSchema,
	chatHubVectorStoreProviderSchema,
	type ChatHubLLMProvider,
	type ChatHubSemanticSearchSettings,
} from '@MNI/api-types';

export const DEFAULT_CONTEXT_WINDOW_LENGTH = 20;

export type NodeTypeNameVersion = { name: string; version: number };

export const EMBEDDINGS_NODE_TYPE_MAP: Partial<Record<ChatHubLLMProvider, NodeTypeNameVersion>> = {
	openai: {
		name: '@MNI/MNI-nodes-langchain.embeddingsOpenAi',
		version: 1.2,
	},
	google: {
		name: '@MNI/MNI-nodes-langchain.embeddingsGoogleGemini',
		version: 1,
	},
	azureOpenAi: {
		name: '@MNI/MNI-nodes-langchain.embeddingsAzureOpenAi',
		version: 1,
	},
	azureEntraId: {
		name: '@MNI/MNI-nodes-langchain.embeddingsAzureOpenAi',
		version: 1,
	},
	ollama: {
		name: '@MNI/MNI-nodes-langchain.embeddingsOllama',
		version: 1,
	},
	awsBedrock: {
		name: '@MNI/MNI-nodes-langchain.embeddingsAwsBedrock',
		version: 1,
	},
	cohere: {
		name: '@MNI/MNI-nodes-langchain.embeddingsCohere',
		version: 1,
	},
	mistralCloud: {
		name: '@MNI/MNI-nodes-langchain.embeddingsMistralCloud',
		version: 1,
	},
};

export const DEFAULT_SEMANTIC_SEARCH_SETTINGS: ChatHubSemanticSearchSettings = {
	embeddingModel: {
		credentialId: null,
		provider: chatHubLLMProviderSchema.options.filter(
			(provider) => provider in EMBEDDINGS_NODE_TYPE_MAP,
		)[0],
	},
	vectorStore: { credentialId: null, provider: chatHubVectorStoreProviderSchema.options[0] },
};
