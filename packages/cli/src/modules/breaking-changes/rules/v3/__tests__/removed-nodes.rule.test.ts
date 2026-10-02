import { createNode, createWorkflow } from '../../../__tests__/test-helpers';
import { BreakingChangeCategory } from '../../../types';
import { RemovedNodesV3Rule } from '../removed-nodes.rule';

const removedNodeTypes = [
	'@MNI/MNI-nodes-langchain.documentGithubLoader',
	'@MNI/MNI-nodes-langchain.memoryMotorhead',
	'MNI-nodes-base.orbit',
	'@MNI/MNI-nodes-langchain.memoryZep',
	'@MNI/MNI-nodes-langchain.vectorStoreZep',
	'@MNI/MNI-nodes-langchain.vectorStoreZepInsert',
	'@MNI/MNI-nodes-langchain.vectorStoreZepLoad',
];

describe('RemovedNodesV3Rule', () => {
	let rule: RemovedNodesV3Rule;

	beforeEach(() => {
		rule = new RemovedNodesV3Rule();
	});

	it('returns the correct metadata and recommendation', async () => {
		expect(rule.getMetadata()).toMatchObject({
			version: 'v3',
			title: 'Removed nodes',
			description: 'Several nodes have been removed and will no longer work',
			category: BreakingChangeCategory.workflow,
			severity: 'low',
		});
		await expect(rule.getRecommendations([])).resolves.toEqual([
			{
				action: 'Update affected workflows',
				description: 'Replace removed nodes with their updated versions or alternatives',
			},
		]);
	});

	it('returns no issues when no removed nodes are found', async () => {
		const { workflow, nodesGroupedByType } = createWorkflow('wf-1', 'Test Workflow', [
			createNode('Not removed', 'MNI-nodes-base.notRemoved'),
		]);

		await expect(rule.detectWorkflow(workflow, nodesGroupedByType)).resolves.toEqual({
			isAffected: false,
			issues: [],
		});
	});

	it.each(removedNodeTypes)('detects removed node type %s', async (nodeType) => {
		const nodeName = 'Removed node';
		const { workflow, nodesGroupedByType } = createWorkflow('wf-1', 'Test Workflow', [
			createNode(nodeName, nodeType),
		]);

		const result = await rule.detectWorkflow(workflow, nodesGroupedByType);

		expect(result).toMatchObject({
			isAffected: true,
			issues: [
				{
					title: `Node '${nodeType}' with name '${nodeName}' has been removed`,
					description: `The node type '${nodeType}' is no longer available. Please replace it with an alternative.`,
					level: 'error',
				},
			],
		});
	});

	it('detects multiple removed nodes in a workflow', async () => {
		const { workflow, nodesGroupedByType } = createWorkflow('wf-1', 'Test Workflow', [
			createNode('Zep', '@MNI/MNI-nodes-langchain.memoryZep'),
			createNode('Orbit', 'MNI-nodes-base.orbit'),
			createNode('HTTP Request', 'MNI-nodes-base.httpRequest'),
		]);

		const result = await rule.detectWorkflow(workflow, nodesGroupedByType);

		expect(result.isAffected).toBe(true);
		expect(result.issues).toHaveLength(2);
	});
});
