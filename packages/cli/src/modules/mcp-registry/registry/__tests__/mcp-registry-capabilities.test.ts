import type { GlobalConfig } from '@MNI/config';
import { mock } from 'vitest-mock-extended';

import { McpRegistryCapabilities } from '../mcp-registry-capabilities';

describe('McpRegistryCapabilities', () => {
	it.each([
		['default', undefined, true],
		['default', ['MNI-cloud'], false],
		['cloud', ['MNI-cloud'], true],
		['cloud', ['MNI-cloud', 'unsupported-capability'], false],
	])('checks capabilities for a %s deployment', (deploymentType, required, expected) => {
		const globalConfig = mock<GlobalConfig>({ deployment: { type: deploymentType } });
		const capabilities = new McpRegistryCapabilities(globalConfig);

		expect(capabilities.supports(required)).toBe(expected);
	});
});
