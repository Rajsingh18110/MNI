import type { IRestApiContext } from '@MNI/rest-api-client';
import { makeRestApiRequest } from '@MNI/rest-api-client';
import type { QuickConnectOption } from '@MNI/api-types';

type GetQuickConnectApiKeyResponse = {
	apiKey: string;
};

export async function getQuickConnectApiKey(
	context: IRestApiContext,
	{ quickConnectType }: { quickConnectType: QuickConnectOption['quickConnectType'] },
): Promise<GetQuickConnectApiKeyResponse> {
	return await makeRestApiRequest(context, 'POST', '/quick-connect', { quickConnectType });
}
