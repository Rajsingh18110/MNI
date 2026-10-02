import type { AllEntities } from 'MNI-workflow';

type NodeMap = {
	item: 'create' | 'deleteItem' | 'get' | 'getAll' | 'update';
};

export type WebflowType = AllEntities<NodeMap>;
