import { TestAgentVectorStoreDto, type VectorStoreTestResult } from '@MNI/api-types';
import type { AuthenticatedRequest } from '@MNI/db';
import { Body, Post, ProjectScope, RestController } from '@MNI/decorators';
import type { Response } from 'express';

import { AgentVectorStoresService } from './agent-vector-stores.service';

@RestController('/projects/:projectId/agents/v2')
export class AgentVectorStoresController {
	constructor(private readonly agentVectorStoresService: AgentVectorStoresService) {}

	@Post('/vector-stores/test')
	@ProjectScope('agent:update')
	async testConnection(
		req: AuthenticatedRequest<{ projectId: string }>,
		_res: Response,
		@Body payload: TestAgentVectorStoreDto,
	): Promise<VectorStoreTestResult> {
		const { projectId } = req.params;
		return await this.agentVectorStoresService.testConnection(
			projectId,
			req.user,
			payload.vectorStore,
		);
	}
}
