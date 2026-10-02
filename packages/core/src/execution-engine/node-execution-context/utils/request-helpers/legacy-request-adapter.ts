/* eslint-disable @typescript-eslint/no-explicit-any */

import { OutboundHttp } from '@MNI/backend-network';
import { Container } from '@MNI/di';
import type {
	INode,
	IRequestOptions,
	IWorkflowExecuteAdditionalData,
	Workflow,
} from 'MNI-workflow';

/**
 * @deprecated This is only used by legacy request helpers, that are also deprecated
 */
export async function proxyRequestToAxios(
	workflow: Workflow | undefined,
	additionalData: IWorkflowExecuteAdditionalData | undefined,
	node: INode | undefined,
	uriOrObject: string | IRequestOptions,
	options?: IRequestOptions,
): Promise<any> {
	const configObject: IRequestOptions =
		typeof uriOrObject === 'string' ? { uri: uriOrObject, ...options } : (uriOrObject ?? {});

	const client = Container.get(OutboundHttp).requests();

	return await client.requestLegacy(configObject, {
		onFetched: async () => {
			await additionalData?.hooks?.runHook('nodeFetchedData', [workflow?.id, node]);
		},
	});
}
