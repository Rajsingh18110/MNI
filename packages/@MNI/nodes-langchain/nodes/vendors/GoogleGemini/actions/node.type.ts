import type { AllEntities } from 'MNI-workflow';

type NodeMap = {
	text: 'message';
	image: 'analyze' | 'generate';
	video: 'analyze' | 'generate' | 'download';
	audio: 'transcribe' | 'analyze';
	document: 'analyze';
	file: 'upload';
	fileSearch: 'createStore' | 'deleteStore' | 'listStores' | 'uploadToStore';
};

export type GoogleGeminiType = AllEntities<NodeMap>;
