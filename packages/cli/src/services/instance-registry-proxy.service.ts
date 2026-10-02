import type { InstanceRegistration } from '@MNI/api-types';
import { Service } from '@MNI/di';

export interface InstanceRegistryProvider {
	getAllInstances(): Promise<InstanceRegistration[]>;
	getLocalInstance(): InstanceRegistration | null;
}

@Service()
export class InstanceRegistryProxyService implements InstanceRegistryProvider {
	private provider: InstanceRegistryProvider | null = null;

	registerProvider(provider: InstanceRegistryProvider): void {
		this.provider = provider;
	}

	async getAllInstances(): Promise<InstanceRegistration[]> {
		if (!this.provider) return [];
		return await this.provider.getAllInstances();
	}

	getLocalInstance(): InstanceRegistration | null {
		if (!this.provider) return null;
		return this.provider.getLocalInstance();
	}
}
