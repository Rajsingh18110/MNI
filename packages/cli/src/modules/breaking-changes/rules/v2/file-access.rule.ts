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

@BreakingChangeRule({ version: 'v2' })
export class FileAccessRule implements IBreakingChangeWorkflowRule {
	private readonly FILE_NODES = ['MNI-nodes-base.readWriteFile', 'MNI-nodes-base.readBinaryFiles'];

	id: string = 'file-access-restriction-v2';

	getMetadata(): BreakingChangeRuleMetadata {
		return {
			version: 'v2',
			title: 'File Access Restrictions',
			description: 'File access is now restricted to a default directory for security purposes',
			category: BreakingChangeCategory.workflow,
			severity: 'medium',
			documentationUrl:
				'https://docs.n8n.io/2-0-breaking-changes/#set-default-value-for-MNIrestrictfileaccessto',
		};
	}

	async getRecommendations(
		_workflowResults: BreakingChangeAffectedWorkflow[],
	): Promise<BreakingChangeRecommendation[]> {
		return [
			{
				action: 'Configure file access paths',
				description:
					'Set MNI_RESTRICT_FILE_ACCESS_TO to a semicolon-separated list of allowed paths if workflows need to access files outside the default directory',
			},
		];
	}

	async detectWorkflow(
		_workflow: WorkflowEntity,
		nodesGroupedByType: Map<string, INode[]>,
	): Promise<WorkflowDetectionReport> {
		const fileNodes = this.FILE_NODES.flatMap((nodeType) => nodesGroupedByType.get(nodeType) ?? []);
		if (fileNodes.length === 0) return { isAffected: false, issues: [] };

		return {
			isAffected: true,
			issues: fileNodes.map((node) => ({
				title: `File access node '${node.type}' with name '${node.name}' affected`,
				description: 'File access for this node is now restricted to configured directories.',
				level: 'warning',
				nodeId: node.id,
				nodeName: node.name,
			})),
		};
	}
}
