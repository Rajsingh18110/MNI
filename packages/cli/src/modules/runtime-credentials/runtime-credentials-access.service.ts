import { Service } from '@MNI/di';
import { Cipher } from 'MNI-core';
import type { IDataObject, IRunExecutionData } from 'MNI-workflow';
import { toSecureArtifacts } from 'MNI-workflow';

import { RuntimeCredentialProvider } from '@/services/runtime-credential-proxy.service';

@Service()
export class RuntimeCredentialsAccessService implements RuntimeCredentialProvider {
	constructor(private readonly cipher: Cipher) {}

	async getRuntimeCredential(
		runExecutionData: IRunExecutionData,
		alias: string,
	): Promise<IDataObject[string] | undefined> {
		const secureArtifacts = runExecutionData.executionData?.runtimeData?.secureArtifacts;

		if (typeof secureArtifacts === 'string') {
			const decryptedSecureArtifacts = await this.cipher.decryptV2(secureArtifacts);
			const parsedSecureArtifacts = toSecureArtifacts(decryptedSecureArtifacts);

			return parsedSecureArtifacts.artifacts[alias];
		}
		return undefined;
	}
}
