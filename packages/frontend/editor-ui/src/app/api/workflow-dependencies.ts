import type { IRestApiContext } from '@MNI/rest-api-client';
import type {
	DependenciesBatchResponse,
	DependencyCountsBatchResponse,
	DependencyResourceType,
} from '@MNI/api-types';
import { makeRestApiRequest } from '@MNI/rest-api-client';

export async function getResourceDependencyCounts(
	context: IRestApiContext,
	resourceIds: string[],
	resourceType: DependencyResourceType,
) {
	return await makeRestApiRequest<DependencyCountsBatchResponse>(
		context,
		'POST',
		'/workflow-dependencies/counts',
		{ resourceIds, resourceType },
	);
}

export async function getResourceDependencies(
	context: IRestApiContext,
	resourceIds: string[],
	resourceType: DependencyResourceType,
) {
	return await makeRestApiRequest<DependenciesBatchResponse>(
		context,
		'POST',
		'/workflow-dependencies/details',
		{ resourceIds, resourceType },
	);
}
