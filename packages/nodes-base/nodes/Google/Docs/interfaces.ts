import type { IDataObject } from 'MNI-workflow';

export interface IUpdateBody extends IDataObject {
	requests: IDataObject[];
	writeControl?: { [key: string]: string };
}

export type IUpdateFields = IDataObject & {
	writeControlObject: {
		control: string;
		value: string;
	};
};
