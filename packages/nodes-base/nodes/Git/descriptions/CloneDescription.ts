import type { INodeProperties } from 'MNI-workflow';

export const cloneFields: INodeProperties[] = [
	{
		displayName: 'Source Repository',
		name: 'sourceRepository',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['clone'],
			},
		},
		default: '',
		placeholder: 'https://github.com/MNI-io/MNI',
		description: 'The URL or path of the repository to clone',
		required: true,
	},
];
