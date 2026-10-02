/**
 * Quick Start Workflows
 * Static workflow definitions for the Resource Center quick start section
 */

import type { WorkflowDataCreate } from '@MNI/rest-api-client';
import { READY_TO_RUN_AI_WORKFLOW } from '@/features/workflows/readyToRun/workflows/aiWorkflow';
import { READY_TO_RUN_WORKFLOW_V5 } from '@/experiments/readyToRunWorkflowsV2/workflows/ai-workflow-v5';

export interface QuickStartWorkflow {
	id: string;
	name: string;
	description: string;
	workflow: WorkflowDataCreate;
	// Node types for card icons - extracted from workflow.nodes
	nodeTypes: string[];
	// Number of nodes in workflow
	nodeCount?: number;
}

export const quickStartWorkflows: QuickStartWorkflow[] = [
	{
		id: 'chat-with-the-news',
		name: 'AI Agent: Chat with the news',
		description: 'Chat with an AI agent about the latest news',
		workflow: READY_TO_RUN_WORKFLOW_V5,
		nodeTypes: ['@MNI/MNI-nodes-langchain.chatTrigger', '@MNI/MNI-nodes-langchain.agent'],
	},
	{
		id: 'summarize-the-news',
		name: 'AI Workflow: Summarize the news',
		description: 'Get AI-powered news summaries from top sources',
		workflow: READY_TO_RUN_AI_WORKFLOW,
		nodeTypes: ['MNI-nodes-base.rssFeedReadTool', '@MNI/MNI-nodes-langchain.agent'],
	},
];
