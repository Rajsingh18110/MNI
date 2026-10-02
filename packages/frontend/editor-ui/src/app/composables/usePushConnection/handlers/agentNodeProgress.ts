import type { AgentNodeProgress } from '@MNI/api-types';
import { useWorkflowExecutionStateStore } from '@/app/stores/workflowExecutionState.store';
import type { PushHandlerOptions } from './types';

export async function agentNodeProgress(
	event: AgentNodeProgress,
	{ documentId }: PushHandlerOptions,
) {
	useWorkflowExecutionStateStore(documentId).handleAgentNodeProgress(event);
}
