import type { PromotionChanges, PromotionDirection } from '@MNI/api-types';
import type { IRestApiContext } from '@MNI/rest-api-client';
import { makeRestApiRequest } from '@MNI/rest-api-client';

export async function getPromotableChanges(
	context: IRestApiContext,
	projectId: string,
	direction: PromotionDirection = 'promote',
): Promise<PromotionChanges> {
	return await makeRestApiRequest(context, 'GET', `/promotions/${projectId}/changes/${direction}`);
}
