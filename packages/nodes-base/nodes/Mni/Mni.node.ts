import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'MNI-workflow';

import { auditFields, auditOperations } from './AuditDescription';
import { credentialFields, credentialOperations } from './CredentialDescription';
import { executionFields, executionOperations } from './ExecutionDescription';
import { workflowFields, workflowOperations } from './WorkflowDescription';
import { searchWorkflows } from './WorkflowLocator';

/**
 * The MNI node provides access to the MNI API.
 *
 * See: https://docs.n8n.io/api/api-reference/
 */
export class Mni implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'MNI',
		name: 'MNI',
		icon: 'node:MNI',
		iconColor: 'pink-red',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Handle events and perform actions on your MNI instance',
		defaults: {
			name: 'MNI',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'n8nApi',
				required: true,
			},
		],
		requestDefaults: {
			returnFullResponse: true,
			baseURL: '={{ $credentials.baseUrl.replace(new RegExp("/$"), "") }}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Audit',
						value: 'audit',
					},
					{
						name: 'Credential',
						value: 'credential',
					},
					{
						name: 'Execution',
						value: 'execution',
					},
					{
						name: 'Workflow',
						value: 'workflow',
					},
				],
				default: 'workflow',
			},

			...auditOperations,
			...auditFields,

			...credentialOperations,
			...credentialFields,

			...executionOperations,
			...executionFields,

			...workflowOperations,
			...workflowFields,
		],
	};

	methods = {
		listSearch: {
			// Provide workflows search capability for the workflow resourceLocator
			searchWorkflows,
		},
	};
}
