import type { IDataObject } from 'MNI-workflow';

export interface ITables {
	[key: string]: {
		[key: string]: IDataObject[];
	};
}

export type OperationInputData = {
	table: string;
	columnString: string;
	items: IDataObject[];
};
