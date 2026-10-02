import { Service } from '@MNI/di';
import type { IDataObject, IRunExecutionData } from 'MNI-workflow';

export interface RuntimeCredentialProvider {
	getRuntimeCredential(
		runExecutionData: IRunExecutionData,
		alias: string,
	): Promise<IDataObject[string] | undefined>;
}

@Service()
export class RuntimeCredentialProxyService implements RuntimeCredentialProvider {
	private provider: RuntimeCredentialProvider | null = null;

	registerProvider(provider: RuntimeCredentialProvider): void {
		this.provider = provider;
	}

	async getRuntimeCredential(
		runExecutionData: IRunExecutionData,
		alias: string,
	): Promise<IDataObject[string] | undefined> {
		if (this.provider) {
			return await this.provider.getRuntimeCredential(runExecutionData, alias);
		}
		return undefined;
	}
}
