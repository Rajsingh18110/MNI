import type { Logger } from '@MNI/backend-common';
import type { AuthenticatedRequest } from '@MNI/db';
import type { Response } from 'express';
import { mock } from 'vitest-mock-extended';

import type { AgentKnowledgeService } from '../agent-knowledge.service';
import { AgentSandboxController } from '../agent-sandbox.controller';
import type { AgentSandboxRuntimeService } from '../agent-sandbox-runtime.service';

describe('AgentSandboxController', () => {
	it('accepts knowledge sandbox warmup before files exist', async () => {
		const agentKnowledgeService = mock<AgentKnowledgeService>();
		const controller = new AgentSandboxController(
			agentKnowledgeService,
			mock<Logger>(),
			mock<AgentSandboxRuntimeService>({ isEnabled: () => true }),
		);
		const req = { user: { id: 'user-1' } } as AuthenticatedRequest<{ projectId: string }>;
		const res = mock<Response>();

		await expect(
			controller.warmKnowledgeSandbox(req, res, 'project-1', 'agent-1'),
		).resolves.toEqual({ accepted: true });
		await new Promise<void>((resolve) => {
			setImmediate(resolve);
		});

		expect(res.status).toHaveBeenCalledWith(202);
		expect(agentKnowledgeService.warmKnowledgeSandbox).toHaveBeenCalledWith('agent-1', 'project-1');
	});

	it('rejects warmup when the knowledge base is disabled', async () => {
		const agentKnowledgeService = mock<AgentKnowledgeService>();
		const controller = new AgentSandboxController(
			agentKnowledgeService,
			mock<Logger>(),
			mock<AgentSandboxRuntimeService>({ isEnabled: () => false }),
		);

		await expect(
			controller.warmKnowledgeSandbox(
				{} as AuthenticatedRequest<{ projectId: string }>,
				mock<Response>(),
				'project-1',
				'agent-1',
			),
		).rejects.toThrow('Agent knowledge base is not enabled');
		expect(agentKnowledgeService.warmKnowledgeSandbox).not.toHaveBeenCalled();
	});
});
