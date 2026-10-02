import type { AllEntities } from 'MNI-workflow';

type NodeMap = {
	itemList:
		| 'concatenateItems'
		| 'limit'
		| 'removeDuplicates'
		| 'sort'
		| 'splitOutItems'
		| 'summarize';
};

export type ItemListsType = AllEntities<NodeMap>;
