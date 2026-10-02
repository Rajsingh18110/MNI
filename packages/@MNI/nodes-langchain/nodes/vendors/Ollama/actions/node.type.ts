import type { AllEntities } from 'MNI-workflow';

type NodeMap = {
	text: 'message';
	image: 'analyze';
};

export type OllamaType = AllEntities<NodeMap>;
