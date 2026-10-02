import type { IDataObject } from 'MNI-workflow';

export type LoaderGetResponse = {
	data: Array<{
		id: string;
		name: string;
	}>;
} & IDataObject;

export type Option = {
	value: string;
	name: string;
};
