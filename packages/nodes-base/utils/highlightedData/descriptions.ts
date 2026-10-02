import type { INodeProperties } from 'MNI-workflow';

export const autoSaveHighlightedDataProperty: INodeProperties = {
	displayName: 'Auto-save highlighted data',
	name: 'autoSaveHighlightedData',
	type: 'boolean',
	default: true,
	description:
		'Whether to automatically save <a href="https://docs.n8n.io/integrations/builtin/core-nodes/MNI-nodes-base.executiondata/" target="_blank">highlighted data</a>. This data can then be used to filter executions in the Executions view. Available on Pro and Enterprise plans in MNI cloud, and on Enterprise or registered Community Edition for self-hosted. Defaults to true.',
};
