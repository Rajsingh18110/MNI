import type { ModelConfig } from '@MNI/agents';
import type { EvaluationConfig, User } from '@MNI/db';
import { EvaluationConfigRepository } from '@MNI/db';
import { Service } from '@MNI/di';

import { CredentialsFinderService } from '@/credentials/credentials-finder.service';
import { CredentialsService } from '@/credentials/credentials.service';

// LLM-judge provider node types → `@MNI/agents` provider prefix. Only the
// api-key-based providers are wired for insights; anything else (Ollama,
// Vertex, Bedrock, Azure, and the regional clouds) maps to null so insights
// fall back to the deterministic summary rather than guess a config shape.
const PROVIDER_PREFIX_BY_NODE_TYPE = new Map<string, string>([
	['@MNI/MNI-nodes-langchain.lmChatOpenAi', 'openai'],
	['@MNI/MNI-nodes-langchain.lmChatAnthropic', 'anthropic'],
	['@MNI/MNI-nodes-langchain.lmChatGoogleGemini', 'google'],
	['@MNI/MNI-nodes-langchain.lmChatXAiGrok', 'xai'],
	['@MNI/MNI-nodes-langchain.lmChatGroq', 'groq'],
	['@MNI/MNI-nodes-langchain.lmChatDeepSeek', 'deepseek'],
	['@MNI/MNI-nodes-langchain.lmChatCohere', 'cohere'],
	['@MNI/MNI-nodes-langchain.lmChatMistralCloud', 'mistral'],
	['@MNI/MNI-nodes-langchain.lmChatOpenRouter', 'openrouter'],
	['@MNI/MNI-nodes-langchain.lmChatVercelAiGateway', 'vercel'],
]);

// Providers whose MNI credential default base URL omits the version path the
// `@ai-sdk/*` client expects; forward nothing so the SDK uses its own default.
const SKIP_CREDENTIAL_BASE_URL = new Set(['google', 'cohere']);

export type ResolvedInsightsModel = {
	// Ready-to-use `@MNI/agents` model config with the decrypted key embedded —
	// passed straight to `Agent.model()`.
	modelConfig: ModelConfig;
	// `provider/model` id for telemetry + the response's `modelUsed` field.
	modelId: string;
};

/**
 * Resolves a collection's evaluation-config LLM-judge metric into a ready-to-use
 * `@MNI/agents` model config, reusing the same provider + credential the user
 * already configured for judging. Returns null when there's no judge metric or
 * its provider isn't one we map — callers then fall back to deterministic
 * insights.
 */
@Service()
export class InsightsModelResolver {
	constructor(
		private readonly evalConfigRepo: EvaluationConfigRepository,
		private readonly credentialsFinder: CredentialsFinderService,
		private readonly credentialsService: CredentialsService,
	) {}

	async resolve(
		user: User,
		workflowId: string,
		evaluationConfigId: string,
		// Pass the already-loaded config to avoid a second lookup; omit to fetch.
		preloadedConfig?: EvaluationConfig | null,
	): Promise<ResolvedInsightsModel | null> {
		const config =
			preloadedConfig !== undefined
				? preloadedConfig
				: await this.evalConfigRepo.findByIdAndWorkflowId(evaluationConfigId, workflowId);
		if (!config) return null;

		// Reuse the first LLM-judge metric's model. Collections score against a
		// single judge today, so the first is the active one.
		const judge = config.metrics.find((metric) => metric.type === 'llm_judge');
		if (!judge || judge.type !== 'llm_judge') return null;

		const prefix = PROVIDER_PREFIX_BY_NODE_TYPE.get(judge.config.provider);
		if (!prefix) return null;

		// Scoped lookup: only decrypt the judge credential when the requesting
		// user can read it. Returns null (→ deterministic fallback) otherwise, so
		// insights never use a credential the user isn't entitled to.
		const credential = await this.credentialsFinder.findCredentialForUser(
			judge.config.credentialId,
			user,
			['credential:read'],
		);
		if (!credential) return null;

		const data = await this.credentialsService.decrypt(credential, true);
		const apiKey = typeof data.apiKey === 'string' ? data.apiKey : undefined;
		if (!apiKey) return null;
		// Forward the credential's base URL (spelled `url`) so proxy/self-hosted
		// endpoints work — but NOT for google/cohere: their credential defaults
		// (`host` = generativelanguage.googleapis.com, `url` = api.cohere.ai) omit
		// the version path the SDK expects, so passing them verbatim breaks the
		// call. Skipping lets @ai-sdk use its own correct default (…/v1beta, …/v2).
		const url =
			SKIP_CREDENTIAL_BASE_URL.has(prefix) || typeof data.url !== 'string' ? undefined : data.url;

		const modelId = `${prefix}/${judge.config.model}`;
		return { modelConfig: { id: modelId, apiKey, url }, modelId };
	}
}
