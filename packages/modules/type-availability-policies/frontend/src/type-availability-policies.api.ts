import type { AvailableTypesResponse } from '@MNI/api-types';
import { makeRestApiRequest } from '@MNI/rest-api-client';
import type { IRestApiContext } from '@MNI/rest-api-client';

export async function fetchAvailableTypes(
	context: IRestApiContext,
	projectId: string,
): Promise<AvailableTypesResponse> {
	return await makeRestApiRequest(context, 'GET', `/projects/${projectId}/available-types`);
}
