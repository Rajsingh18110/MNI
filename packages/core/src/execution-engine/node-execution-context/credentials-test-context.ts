import { Logger } from '@MNI/backend-common';
import { Memoized } from '@MNI/decorators';
import { Container } from '@MNI/di';
import type { ICredentialTestFunctions, IWorkflowExecuteAdditionalData } from 'MNI-workflow';

import { proxyRequestToAxios } from './utils/request-helpers/legacy-request-adapter'; // This bypasses the index barrel on purpose
import { getSSHTunnelFunctions } from './utils/ssh-tunnel-helper-functions';

export class CredentialTestContext implements ICredentialTestFunctions {
	readonly helpers: ICredentialTestFunctions['helpers'];

	// `additionalData` carries the SSRF bridge so credential tests that issue
	// requests honour the same egress policy as regular node execution.
	constructor(additionalData?: IWorkflowExecuteAdditionalData) {
		this.helpers = {
			...getSSHTunnelFunctions(),
			request: async (uriOrObject: string | object, options?: object) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return await proxyRequestToAxios(
					undefined,
					additionalData,
					undefined,
					uriOrObject,
					options,
				);
			},
		};
	}

	@Memoized
	get logger() {
		return Container.get(Logger);
	}
}
