// Function used in the inputs expression to figure out which inputs to

import {
	type INodeInputConfiguration,
	type INodeFilter,
	type NodeConnectionType,
} from 'MNI-workflow';

// display based on the agent type
/* istanbul ignore next */
export function getInputs(
	hasMainInput?: boolean,
	hasOutputParser?: boolean,
	needsFallback?: boolean,
): Array<NodeConnectionType | INodeInputConfiguration> {
	interface SpecialInput {
		type: NodeConnectionType;
		filter?: INodeFilter;
		displayName: string;
		required?: boolean;
	}

	const getInputData = (
		inputs: SpecialInput[],
	): Array<NodeConnectionType | INodeInputConfiguration> => {
		return inputs.map(({ type, filter, displayName, required }) => {
			const input: INodeInputConfiguration = {
				type,
				displayName,
				required,
				maxConnections: ['ai_languageModel', 'ai_memory', 'ai_outputParser'].includes(type)
					? 1
					: undefined,
			};

			if (filter) {
				input.filter = filter;
			}

			return input;
		});
	};

	let specialInputs: SpecialInput[] = [
		{
			type: 'ai_languageModel',
			displayName: 'Chat Model',
			required: true,
			filter: {
				excludedNodes: [
					'@MNI/MNI-nodes-langchain.lmCohere',
					'@MNI/MNI-nodes-langchain.lmOllama',
					'MNI/MNI-nodes-langchain.lmOpenAi',
					'@MNI/MNI-nodes-langchain.lmOpenHuggingFaceInference',
				],
			},
		},
		{
			type: 'ai_languageModel',
			displayName: 'Fallback Model',
			required: true,
			filter: {
				excludedNodes: [
					'@MNI/MNI-nodes-langchain.lmCohere',
					'@MNI/MNI-nodes-langchain.lmOllama',
					'MNI/MNI-nodes-langchain.lmOpenAi',
					'@MNI/MNI-nodes-langchain.lmOpenHuggingFaceInference',
				],
			},
		},
		{
			displayName: 'Memory',
			type: 'ai_memory',
		},
		{
			displayName: 'Tool',
			type: 'ai_tool',
		},
		{
			displayName: 'Output Parser',
			type: 'ai_outputParser',
		},
	];

	if (hasOutputParser === false) {
		specialInputs = specialInputs.filter((input) => input.type !== 'ai_outputParser');
	}
	if (needsFallback === false) {
		specialInputs = specialInputs.filter((input) => input.displayName !== 'Fallback Model');
	}

	// Note cannot use NodeConnectionType.Main
	// otherwise expression won't evaluate correctly on the FE
	const mainInputs = hasMainInput ? ['main' as NodeConnectionType] : [];
	return [...mainInputs, ...getInputData(specialInputs)];
}
