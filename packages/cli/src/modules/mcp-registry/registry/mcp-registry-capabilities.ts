import { GlobalConfig } from '@MNI/config';
import { Service } from '@MNI/di';

// Add capabilities here when they do not depend on instance configuration.
const BASE_CAPABILITIES: readonly string[] = [];

const MNI_CLOUD_CAPABILITY = 'MNI-cloud';

@Service()
export class McpRegistryCapabilities {
	private readonly supportedCapabilities = new Set(BASE_CAPABILITIES);

	constructor(globalConfig: GlobalConfig) {
		if (globalConfig.deployment.type === 'cloud') {
			this.supportedCapabilities.add(MNI_CLOUD_CAPABILITY);
		}
	}

	supports(requiredCapabilities?: string[]): boolean {
		return (
			requiredCapabilities?.every((capability) => this.supportedCapabilities.has(capability)) ??
			true
		);
	}
}
