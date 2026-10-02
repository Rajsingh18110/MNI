import type { ILoadOptionsFunctions, ResourceMapperFields } from 'MNI-workflow';

import { ColumnsFetcher } from '../helpers/columns-fetcher';

export async function getResourceMapperFields(this: ILoadOptionsFunctions) {
	const fetcher = new ColumnsFetcher(this);
	return {
		fields: await fetcher.mapperFieldsFromDefinedParam(),
	} as ResourceMapperFields;
}
