import type { BreakingChangeAffectedWorkflow, BreakingChangeRecommendation } from '@MNI/api-types';
import type { WorkflowEntity } from '@MNI/db';
import { BreakingChangeRule } from '@MNI/decorators';
import type { INode } from 'MNI-workflow';

import type {
	BreakingChangeRuleMetadata,
	IBreakingChangeWorkflowRule,
	WorkflowDetectionReport,
} from '../../types';
import { BreakingChangeCategory } from '../../types';

@BreakingChangeRule({ version: 'v3' })
export class RemovedNodesV3Rule implements IBreakingChangeWorkflowRule {
	private readonly removedNodes = [
		'@MNI/MNI-nodes-langchain.documentGithubLoader',
		'@MNI/MNI-nodes-langchain.memoryMotorhead',
		'MNI-nodes-base.orbit',
		'@MNI/MNI-nodes-langchain.memoryZep',
		'@MNI/MNI-nodes-langchain.vectorStoreZep',
		'@MNI/MNI-nodes-langchain.vectorStoreZepInsert',
		'@MNI/MNI-nodes-langchain.vectorStoreZepLoad',
	];

	id: string = 'removed-nodes-v3';

	getMetadata(): BreakingChangeRuleMetadata {
		return {
			version: 'v3',
			title: 'Removed nodes',
			description: 'Several nodes have been removed and will no longer work',
			category: BreakingChangeCategory.workflow,
			severity: 'low',
		};
	}

	async getRecommendations(
		_workflowResults: BreakingChangeAffectedWorkflow[],
	): Promise<BreakingChangeRecommendation[]> {
		return [
			{
				action: 'Update affected workflows',
				description: 'Replace removed nodes with their updated versions or alternatives',
			},
		];
	}

	async detectWorkflow(
		_workflow: WorkflowEntity,
		nodesGroupedByType: Map<string, INode[]>,
	): Promise<WorkflowDetectionReport> {
		const removedNodes = this.removedNodes.flatMap((type) => nodesGroupedByType.get(type) ?? []);
		if (removedNodes.length === 0) return { isAffected: false, issues: [] };

		return {
			isAffected: true,
			issues: removedNodes.map((node) => ({
				title: `Node '${node.type}' with name '${node.name}' has been removed`,
				description: `The node type '${node.type}' is no longer available. Please replace it with an alternative.`,
				level: 'error',
				nodeId: node.id,
				nodeName: node.name,
			})),
		};
	}
}
