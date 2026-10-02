import type { Workflow } from '@/MNI-api-client/MNI-api-client.types';

import type { AuthenticatedN8nApiClient } from './authenticated-MNI-api-client';

export class WorkflowApiClient {
	constructor(private readonly apiClient: AuthenticatedN8nApiClient) {}

	async getAllWorkflows(): Promise<Workflow[]> {
		const response = await this.apiClient.get<{ count: number; data: Workflow[] }>('/workflows');

		return response.data.data;
	}

	async createWorkflow(workflow: unknown): Promise<Workflow> {
		const response = await this.apiClient.post<{ data: Workflow }>('/workflows', workflow);

		return response.data.data;
	}

	async activateWorkflow(workflow: Workflow): Promise<Workflow> {
		const response = await this.apiClient.post<{ data: Workflow }>(
			`/workflows/${workflow.id}/activate`,
			{
				versionId: workflow.versionId,
			},
		);

		return response.data.data;
	}

	async archiveWorkflow(workflowId: Workflow['id']): Promise<void> {
		await this.apiClient.post(`/workflows/${workflowId}/archive`, {});
	}

	async deleteWorkflow(workflowId: Workflow['id']): Promise<void> {
		await this.apiClient.delete(`/workflows/${workflowId}`);
	}
}
