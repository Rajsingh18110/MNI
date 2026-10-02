import type { InstanceAiAgentNode } from '@MNI/api-types';

export interface AgentTreeSnapshot {
	tree: InstanceAiAgentNode;
	runId: string;
	messageGroupId?: string;
	runIds?: string[];
	createdAt?: Date;
	updatedAt?: Date;
}
