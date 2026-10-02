import type { INodeProperties } from 'MNI-workflow';
import { updateDisplayOptions } from 'MNI-workflow';

import { userPoolResourceLocator, userResourceLocator } from '../common.description';

const properties: INodeProperties[] = [
	{
		...userPoolResourceLocator,
		description: 'Select the user pool to use',
	},
	{
		...userResourceLocator,
		description: 'Select the user you want to delete',
	},
];

const displayOptions = {
	show: {
		resource: ['user'],
		operation: ['delete'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);
