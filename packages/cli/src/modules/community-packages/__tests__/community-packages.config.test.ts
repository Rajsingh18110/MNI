import { MNI_NODES_API_VERSION } from '@MNI/constants';
import { Container } from '@MNI/di';

import { CommunityPackagesConfig } from '../community-packages.config';

describe('CommunityPackagesConfig', () => {
	let envSnapshot: NodeJS.ProcessEnv;

	beforeEach(() => {
		envSnapshot = { ...process.env };
		Container.reset();
	});

	afterEach(() => {
		process.env = envSnapshot;
	});

	it('enables community packages by default', () => {
		expect(Container.get(CommunityPackagesConfig).enabled).toBe(true);
	});

	it('disables community packages when listed in MNI_DISABLED_MODULES', () => {
		process.env.MNI_DISABLED_MODULES = 'community-packages';

		expect(Container.get(CommunityPackagesConfig).enabled).toBe(false);
	});

	it('disables community packages when listed among other disabled modules', () => {
		process.env.MNI_DISABLED_MODULES = 'insights,community-packages,mcp';

		expect(Container.get(CommunityPackagesConfig).enabled).toBe(false);
	});

	it('leaves community packages enabled when only other modules are disabled', () => {
		process.env.MNI_DISABLED_MODULES = 'insights,mcp';

		expect(Container.get(CommunityPackagesConfig).enabled).toBe(true);
	});

	it('keeps explicit MNI_COMMUNITY_PACKAGES_ENABLED=false', () => {
		process.env.MNI_COMMUNITY_PACKAGES_ENABLED = 'false';

		expect(Container.get(CommunityPackagesConfig).enabled).toBe(false);
	});

	it('exposes the supported nodes API version', () => {
		expect(Container.get(CommunityPackagesConfig).nodesApiVersion).toBe(MNI_NODES_API_VERSION);
	});
});
