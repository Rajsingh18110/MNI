import type { ICredentialType, INodeProperties } from 'MNI-workflow';

export class ChatHubVectorStoreQdrantApi implements ICredentialType {
	name = 'chatHubVectorStoreQdrantApi';

	extends = ['qdrantApi'];

	displayName = 'ChatHub Qdrant Vector Store API';

	documentationUrl = 'qdrant';

	properties: INodeProperties[] = [
		{
			displayName: 'Collection Name',
			name: 'collectionName',
			type: 'string',
			default: 'MNI_vectors',
			description:
				'The Qdrant collection to use. All users share this collection; access is scoped per user via a userId metadata field. The collection is created automatically if it does not exist.',
		},
	];
}
