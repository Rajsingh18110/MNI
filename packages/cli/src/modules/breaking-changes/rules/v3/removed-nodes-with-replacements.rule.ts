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

type NodeReplacement = {
	id: string;
	removedNodeName: string;
	removedNodeType: string;
	recommendations: BreakingChangeRecommendation[];
};

function createNodeReplacementRule({
	id,
	removedNodeName,
	removedNodeType,
	recommendations,
}: NodeReplacement) {
	@BreakingChangeRule({ version: 'v3' })
	class NodeReplacementRule implements IBreakingChangeWorkflowRule {
		id = `${id}-v3`;

		getMetadata(): BreakingChangeRuleMetadata {
			return {
				version: 'v3',
				title: `${removedNodeName} node removed`,
				description: `The ${removedNodeName} node is no longer supported. ${recommendations.map(({ description }) => description).join(' ')}`,
				category: BreakingChangeCategory.workflow,
				severity: 'medium',
			};
		}

		async getRecommendations(
			_workflowResults: BreakingChangeAffectedWorkflow[],
		): Promise<BreakingChangeRecommendation[]> {
			await Promise.resolve();
			return recommendations;
		}

		async detectWorkflow(
			_workflow: WorkflowEntity,
			nodesGroupedByType: Map<string, INode[]>,
		): Promise<WorkflowDetectionReport> {
			const removedNodes = nodesGroupedByType.get(removedNodeType) ?? [];
			if (removedNodes.length === 0) return { isAffected: false, issues: [] };

			await Promise.resolve();
			return {
				isAffected: true,
				issues: removedNodes.map((node) => ({
					title: `${removedNodeName} node '${node.name}' is no longer supported`,
					description: recommendations
						.map((recommendation) => recommendation.description)
						.join(' '),
					level: 'error',
					nodeId: node.id,
					nodeName: node.name,
				})),
			};
		}
	}

	return NodeReplacementRule;
}

export const BinaryInputLoaderRemovedRule = createNodeReplacementRule({
	id: 'binary-input-loader-removed',
	removedNodeName: 'Binary Input Loader',
	removedNodeType: '@MNI/MNI-nodes-langchain.documentBinaryInputLoader',
	recommendations: [
		{
			action: 'Replace with Default Data Loader',
			description: 'Replace this node with Default Data Loader and set Type of Data to Binary.',
		},
	],
});

export const ChatMessagesRetrieverRemovedRule = createNodeReplacementRule({
	id: 'chat-messages-retriever-removed',
	removedNodeName: 'Chat Messages Retriever',
	removedNodeType: '@MNI/MNI-nodes-langchain.memoryChatRetriever',
	recommendations: [
		{
			action: 'Replace with Memory Manager',
			description:
				'Replace this node with Memory Manager and set Operation Mode to Get Many Messages.',
		},
	],
});

export const ConvertToFromBinaryDataRemovedRule = createNodeReplacementRule({
	id: 'convert-to-from-binary-data-removed',
	removedNodeName: 'Convert to/from binary data',
	removedNodeType: 'MNI-nodes-base.moveBinaryData',
	recommendations: [
		{
			action: 'Replace with Convert to File',
			description:
				'For Base64 data to a binary file, replace this node with Convert to File and select Move Base64 String to File.',
		},
		{
			action: 'Replace with Extract From File',
			description:
				'For a binary file to Base64 data, replace this node with Extract From File and select Move File to Base64 String.',
		},
	],
});

export const CronRemovedRule = createNodeReplacementRule({
	id: 'cron-removed',
	removedNodeName: 'Cron',
	removedNodeType: 'MNI-nodes-base.cron',
	recommendations: [
		{
			action: 'Replace with Schedule Trigger',
			description: 'Replace this node with Schedule Trigger and recreate its schedule rules.',
		},
	],
});

export const FunctionRemovedRule = createNodeReplacementRule({
	id: 'function-removed',
	removedNodeName: 'Function',
	removedNodeType: 'MNI-nodes-base.function',
	recommendations: [
		{
			action: 'Replace with Code',
			description: 'Replace this node with Code and set Mode to Run Once for All Items.',
		},
	],
});

export const FunctionItemRemovedRule = createNodeReplacementRule({
	id: 'function-item-removed',
	removedNodeName: 'Function Item',
	removedNodeType: 'MNI-nodes-base.functionItem',
	recommendations: [
		{
			action: 'Replace with Code',
			description: 'Replace this node with Code and set Mode to Run Once for Each Item.',
		},
	],
});

export const HtmlExtractRemovedRule = createNodeReplacementRule({
	id: 'html-extract-removed',
	removedNodeName: 'HTML Extract',
	removedNodeType: 'MNI-nodes-base.htmlExtract',
	recommendations: [
		{
			action: 'Replace with HTML',
			description: 'Replace this node with HTML and select Extract HTML Content.',
		},
	],
});

export const HttpRequestToolRemovedRule = createNodeReplacementRule({
	id: 'http-request-tool-removed',
	removedNodeName: 'HTTP Request Tool',
	removedNodeType: '@MNI/MNI-nodes-langchain.toolHttpRequest',
	recommendations: [
		{
			action: 'Replace with HTTP Request',
			description: 'Replace this node with HTTP Request and configure it for AI tool use.',
		},
	],
});

export const ICalendarRemovedRule = createNodeReplacementRule({
	id: 'i-calendar-removed',
	removedNodeName: 'iCalendar',
	removedNodeType: 'MNI-nodes-base.iCal',
	recommendations: [
		{
			action: 'Replace with Convert to File',
			description: 'Replace this node with Convert to File and select Convert to ICS.',
		},
	],
});

export const ItemListsRemovedRule = createNodeReplacementRule({
	id: 'item-lists-removed',
	removedNodeName: 'Item Lists',
	removedNodeType: 'MNI-nodes-base.itemLists',
	recommendations: [
		{
			action: 'Replace with Aggregate',
			description: 'For Concatenate Items, replace this node with Aggregate.',
		},
		{
			action: 'Replace with Limit',
			description: 'For Limit, replace this node with Limit.',
		},
		{
			action: 'Replace with Remove Duplicates',
			description: 'For Remove Duplicates, replace this node with Remove Duplicates.',
		},
		{
			action: 'Replace with Sort',
			description: 'For Sort, replace this node with Sort.',
		},
		{
			action: 'Replace with Split Out',
			description: 'For Split Out Items, replace this node with Split Out.',
		},
		{
			action: 'Replace with Summarize',
			description: 'For Summarize, replace this node with Summarize.',
		},
	],
});

export const InMemoryVectorStoreInsertRemovedRule = createNodeReplacementRule({
	id: 'in-memory-vector-store-insert-removed',
	removedNodeName: 'In Memory Vector Store Insert',
	removedNodeType: '@MNI/MNI-nodes-langchain.vectorStoreInMemoryInsert',
	recommendations: [
		{
			action: 'Replace with In-Memory Vector Store',
			description: 'Replace this node with In-Memory Vector Store and select Insert Documents.',
		},
	],
});

export const InMemoryVectorStoreLoadRemovedRule = createNodeReplacementRule({
	id: 'in-memory-vector-store-load-removed',
	removedNodeName: 'In Memory Vector Store Load',
	removedNodeType: '@MNI/MNI-nodes-langchain.vectorStoreInMemoryLoad',
	recommendations: [
		{
			action: 'Replace with In-Memory Vector Store',
			description: 'Replace this node with In-Memory Vector Store and select Get Many.',
		},
	],
});

export const IntervalRemovedRule = createNodeReplacementRule({
	id: 'interval-removed',
	removedNodeName: 'Interval',
	removedNodeType: 'MNI-nodes-base.interval',
	recommendations: [
		{
			action: 'Replace with Schedule Trigger',
			description: 'Replace this node with Schedule Trigger and recreate its interval.',
		},
	],
});

export const JsonInputLoaderRemovedRule = createNodeReplacementRule({
	id: 'json-input-loader-removed',
	removedNodeName: 'JSON Input Loader',
	removedNodeType: '@MNI/MNI-nodes-langchain.documentJsonInputLoader',
	recommendations: [
		{
			action: 'Replace with Default Data Loader',
			description: 'Replace this node with Default Data Loader and set Type of Data to JSON.',
		},
	],
});

export const ManualChatTriggerRemovedRule = createNodeReplacementRule({
	id: 'manual-chat-trigger-removed',
	removedNodeName: 'Manual Chat Trigger',
	removedNodeType: '@MNI/MNI-nodes-langchain.manualChatTrigger',
	recommendations: [
		{
			action: 'Replace with Chat Trigger',
			description: 'Replace this node with Chat Trigger and recreate its chat settings.',
		},
	],
});

export const OpenAiAssistantRemovedRule = createNodeReplacementRule({
	id: 'openai-assistant-removed',
	removedNodeName: 'OpenAI Assistant',
	removedNodeType: '@MNI/MNI-nodes-langchain.openAiAssistant',
	recommendations: [
		{
			action: 'Replace with OpenAI',
			description: 'Replace this node with OpenAI and select the Assistant resource.',
		},
	],
});

export const OpenAiRemovedRule = createNodeReplacementRule({
	id: 'openai-removed',
	removedNodeName: 'OpenAI',
	removedNodeType: 'MNI-nodes-base.openAi',
	recommendations: [
		{
			action: 'Replace with OpenAI',
			description: 'Replace this node with the new OpenAI node and recreate its settings.',
		},
	],
});

export const OpenAiModelRemovedRule = createNodeReplacementRule({
	id: 'openai-model-removed',
	removedNodeName: 'OpenAI Model',
	removedNodeType: '@MNI/MNI-nodes-langchain.lmOpenAi',
	recommendations: [
		{
			action: 'Replace with OpenAI Chat Model',
			description: 'Replace this node with OpenAI Chat Model and recreate its model settings.',
		},
	],
});

export const PineconeInsertRemovedRule = createNodeReplacementRule({
	id: 'pinecone-insert-removed',
	removedNodeName: 'Pinecone: Insert',
	removedNodeType: '@MNI/MNI-nodes-langchain.vectorStorePineconeInsert',
	recommendations: [
		{
			action: 'Replace with Pinecone Vector Store',
			description: 'Replace this node with Pinecone Vector Store and select Insert Documents.',
		},
	],
});

export const PineconeLoadRemovedRule = createNodeReplacementRule({
	id: 'pinecone-load-removed',
	removedNodeName: 'Pinecone: Load',
	removedNodeType: '@MNI/MNI-nodes-langchain.vectorStorePineconeLoad',
	recommendations: [
		{
			action: 'Replace with Pinecone Vector Store',
			description: 'Replace this node with Pinecone Vector Store and select Get Many.',
		},
	],
});

export const ReadBinaryFileRemovedRule = createNodeReplacementRule({
	id: 'read-binary-file-removed',
	removedNodeName: 'Read Binary File',
	removedNodeType: 'MNI-nodes-base.readBinaryFile',
	recommendations: [
		{
			action: 'Replace with Read/Write Files from Disk',
			description:
				'Replace this node with Read/Write Files from Disk and select Read File(s) From Disk.',
		},
	],
});

export const ReadBinaryFilesRemovedRule = createNodeReplacementRule({
	id: 'read-binary-files-removed',
	removedNodeName: 'Read Binary Files',
	removedNodeType: 'MNI-nodes-base.readBinaryFiles',
	recommendations: [
		{
			action: 'Replace with Read/Write Files from Disk',
			description:
				'Replace this node with Read/Write Files from Disk and select Read File(s) From Disk.',
		},
	],
});

export const ReadPdfRemovedRule = createNodeReplacementRule({
	id: 'read-pdf-removed',
	removedNodeName: 'Read PDF',
	removedNodeType: 'MNI-nodes-base.readPDF',
	recommendations: [
		{
			action: 'Replace with Extract From File',
			description: 'Replace this node with Extract From File and select Extract From PDF.',
		},
	],
});

export const SerpApiGoogleSearchRemovedRule = createNodeReplacementRule({
	id: 'serpapi-google-search-removed',
	removedNodeName: 'SerpApi (Google Search)',
	removedNodeType: '@MNI/MNI-nodes-langchain.toolSerpApi',
	recommendations: [
		{
			action: 'Replace with SerpApi',
			description:
				'Replace this node with the verified SerpApi community node and recreate its search settings.',
		},
	],
});

export const SupabaseInsertRemovedRule = createNodeReplacementRule({
	id: 'supabase-insert-removed',
	removedNodeName: 'Supabase: Insert',
	removedNodeType: '@MNI/MNI-nodes-langchain.vectorStoreSupabaseInsert',
	recommendations: [
		{
			action: 'Replace with Supabase Vector Store',
			description: 'Replace this node with Supabase Vector Store and select Insert Documents.',
		},
	],
});

export const SupabaseLoadRemovedRule = createNodeReplacementRule({
	id: 'supabase-load-removed',
	removedNodeName: 'Supabase: Load',
	removedNodeType: '@MNI/MNI-nodes-langchain.vectorStoreSupabaseLoad',
	recommendations: [
		{
			action: 'Replace with Supabase Vector Store',
			description: 'Replace this node with Supabase Vector Store and select Get Many.',
		},
	],
});

export const WorkflowTriggerRemovedRule = createNodeReplacementRule({
	id: 'workflow-trigger-removed',
	removedNodeName: 'Workflow Trigger',
	removedNodeType: 'MNI-nodes-base.workflowTrigger',
	recommendations: [
		{
			action: 'Replace with MNI Trigger',
			description: 'Replace this node with MNI Trigger and recreate its event settings.',
		},
	],
});

export const WriteBinaryFileRemovedRule = createNodeReplacementRule({
	id: 'write-binary-file-removed',
	removedNodeName: 'Write Binary File',
	removedNodeType: 'MNI-nodes-base.writeBinaryFile',
	recommendations: [
		{
			action: 'Replace with Read/Write Files from Disk',
			description:
				'Replace this node with Read/Write Files from Disk and select Write File to Disk.',
		},
	],
});

export const directNodeReplacementRules = [
	{
		rule: BinaryInputLoaderRemovedRule,
		removedNodeType: '@MNI/MNI-nodes-langchain.documentBinaryInputLoader',
	},
	{
		rule: ChatMessagesRetrieverRemovedRule,
		removedNodeType: '@MNI/MNI-nodes-langchain.memoryChatRetriever',
	},
	{ rule: ConvertToFromBinaryDataRemovedRule, removedNodeType: 'MNI-nodes-base.moveBinaryData' },
	{ rule: CronRemovedRule, removedNodeType: 'MNI-nodes-base.cron' },
	{ rule: FunctionRemovedRule, removedNodeType: 'MNI-nodes-base.function' },
	{ rule: FunctionItemRemovedRule, removedNodeType: 'MNI-nodes-base.functionItem' },
	{ rule: HtmlExtractRemovedRule, removedNodeType: 'MNI-nodes-base.htmlExtract' },
	{ rule: HttpRequestToolRemovedRule, removedNodeType: '@MNI/MNI-nodes-langchain.toolHttpRequest' },
	{ rule: ICalendarRemovedRule, removedNodeType: 'MNI-nodes-base.iCal' },
	{ rule: ItemListsRemovedRule, removedNodeType: 'MNI-nodes-base.itemLists' },
	{
		rule: InMemoryVectorStoreInsertRemovedRule,
		removedNodeType: '@MNI/MNI-nodes-langchain.vectorStoreInMemoryInsert',
	},
	{
		rule: InMemoryVectorStoreLoadRemovedRule,
		removedNodeType: '@MNI/MNI-nodes-langchain.vectorStoreInMemoryLoad',
	},
	{ rule: IntervalRemovedRule, removedNodeType: 'MNI-nodes-base.interval' },
	{
		rule: JsonInputLoaderRemovedRule,
		removedNodeType: '@MNI/MNI-nodes-langchain.documentJsonInputLoader',
	},
	{
		rule: ManualChatTriggerRemovedRule,
		removedNodeType: '@MNI/MNI-nodes-langchain.manualChatTrigger',
	},
	{ rule: OpenAiAssistantRemovedRule, removedNodeType: '@MNI/MNI-nodes-langchain.openAiAssistant' },
	{ rule: OpenAiRemovedRule, removedNodeType: 'MNI-nodes-base.openAi' },
	{ rule: OpenAiModelRemovedRule, removedNodeType: '@MNI/MNI-nodes-langchain.lmOpenAi' },
	{
		rule: PineconeInsertRemovedRule,
		removedNodeType: '@MNI/MNI-nodes-langchain.vectorStorePineconeInsert',
	},
	{
		rule: PineconeLoadRemovedRule,
		removedNodeType: '@MNI/MNI-nodes-langchain.vectorStorePineconeLoad',
	},
	{ rule: ReadBinaryFileRemovedRule, removedNodeType: 'MNI-nodes-base.readBinaryFile' },
	{ rule: ReadBinaryFilesRemovedRule, removedNodeType: 'MNI-nodes-base.readBinaryFiles' },
	{ rule: ReadPdfRemovedRule, removedNodeType: 'MNI-nodes-base.readPDF' },
	{ rule: SerpApiGoogleSearchRemovedRule, removedNodeType: '@MNI/MNI-nodes-langchain.toolSerpApi' },
	{
		rule: SupabaseInsertRemovedRule,
		removedNodeType: '@MNI/MNI-nodes-langchain.vectorStoreSupabaseInsert',
	},
	{
		rule: SupabaseLoadRemovedRule,
		removedNodeType: '@MNI/MNI-nodes-langchain.vectorStoreSupabaseLoad',
	},
	{ rule: WorkflowTriggerRemovedRule, removedNodeType: 'MNI-nodes-base.workflowTrigger' },
	{ rule: WriteBinaryFileRemovedRule, removedNodeType: 'MNI-nodes-base.writeBinaryFile' },
];
