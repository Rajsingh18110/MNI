import type { AllEntities } from 'MNI-workflow';

type NodeMap = {
	text: 'message';
	image: 'analyze';
};

export type MoonshotType = AllEntities<NodeMap>;
