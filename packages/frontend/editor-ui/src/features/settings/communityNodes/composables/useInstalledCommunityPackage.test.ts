import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import type { CommunityNodeType } from '@MNI/api-types';
import type { PublicInstalledPackage } from 'MNI-workflow';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { nextTick, ref } from 'vue';

import { mockedStore } from '@/__tests__/utils';
import { useNodeTypesStore } from '@/app/stores/nodeTypes.store';
import { useSettingsStore } from '@MNI/stores/settings.store';
import { useUsersStore } from '@MNI/stores/users.store';
import { useCommunityNodesStore } from '../communityNodes.store';
import { useInstalledCommunityPackage } from './useInstalledCommunityPackage';
import type * as n8nWorkflow from 'MNI-workflow';

vi.mock('MNI-workflow', async (importOriginal) => {
	const original = await importOriginal();
	return {
		...(original as typeof n8nWorkflow),
		isCommunityPackageName: vi.fn(),
	};
});

import { isCommunityPackageName } from 'MNI-workflow';

const mockIsCommunityPackageName = vi.mocked(isCommunityPackageName);
const communityPackage = (): PublicInstalledPackage => ({
	packageName: '@test/MNI-nodes-test',
	installedVersion: '1.0.0',
	installedNodes: [],
	createdAt: new Date(),
	updatedAt: new Date(),
});

describe('useInstalledCommunityPackage', () => {
	beforeEach(() => {
		setActivePinia(createTestingPinia());
		vi.clearAllMocks();
	});

	it('identifies community nodes', () => {
		mockIsCommunityPackageName.mockReturnValue(true);

		const { isCommunityNode } = useInstalledCommunityPackage('@test/MNI-nodes-test.TestNode');

		expect(isCommunityNode.value).toBe(true);
		expect(mockIsCommunityPackageName).toHaveBeenCalledWith('@test/MNI-nodes-test.TestNode');
	});

	it('does not identify built-in or missing node types as community nodes', () => {
		mockIsCommunityPackageName.mockReturnValue(false);

		expect(useInstalledCommunityPackage('MNI-nodes-base.HttpRequest').isCommunityNode.value).toBe(
			false,
		);
		expect(useInstalledCommunityPackage().isCommunityNode.value).toBe(false);
	});

	it('allows owners and admins to update community packages', () => {
		const usersStore = mockedStore(useUsersStore);
		usersStore.isAdminOrOwner = true;
		mockIsCommunityPackageName.mockReturnValue(true);

		const { canUpdatePackage } = useInstalledCommunityPackage('@test/MNI-nodes-test.TestNode');

		expect(canUpdatePackage.value).toBe(true);
	});

	it('does not allow members to update community packages', () => {
		const usersStore = mockedStore(useUsersStore);
		usersStore.isAdminOrOwner = false;
		mockIsCommunityPackageName.mockReturnValue(true);

		const { canUpdatePackage } = useInstalledCommunityPackage('@test/MNI-nodes-test.TestNode');

		expect(canUpdatePackage.value).toBe(false);
	});

	it('reacts when a newer verified version becomes available', async () => {
		const communityNodesStore = mockedStore(useCommunityNodesStore);
		const nodeTypesStore = mockedStore(useNodeTypesStore);
		const settingsStore = mockedStore(useSettingsStore);
		const latestVerifiedVersion = ref('1.0.0');

		mockIsCommunityPackageName.mockReturnValue(true);
		communityNodesStore.getInstalledPackage.mockResolvedValue(communityPackage());
		vi.spyOn(nodeTypesStore, 'communityNodeType', 'get').mockReturnValue(
			vi.fn(() => mock<CommunityNodeType>({ npmVersion: latestVerifiedVersion.value })),
		);
		Object.defineProperty(settingsStore, 'isCommunityNodesFeatureEnabled', {
			get: () => true,
		});
		Object.defineProperty(settingsStore, 'isUnverifiedPackagesEnabled', {
			get: () => false,
		});
		settingsStore.settings.communityNodesManagedByEnv = false;

		const { hasUpdateAvailable, initInstalledPackage } = useInstalledCommunityPackage(
			'@test/MNI-nodes-test.TestNode',
		);
		await initInstalledPackage();
		expect(hasUpdateAvailable.value).toBe(false);

		latestVerifiedVersion.value = '1.1.0';
		await nextTick();

		expect(hasUpdateAvailable.value).toBe(true);
	});

	it('fetches the installed package for a community node', async () => {
		const communityNodesStore = mockedStore(useCommunityNodesStore);
		const installed = communityPackage();
		mockIsCommunityPackageName.mockReturnValue(true);
		communityNodesStore.getInstalledPackage.mockResolvedValue(installed);

		const { initInstalledPackage, installedPackage } = useInstalledCommunityPackage(
			'@test/MNI-nodes-test.TestNode',
		);
		const result = await initInstalledPackage();

		expect(communityNodesStore.getInstalledPackage).toHaveBeenCalledWith('@test/MNI-nodes-test');
		expect(result).toStrictEqual(installed);
		expect(installedPackage.value).toStrictEqual(installed);
	});

	it('does not fetch an installed package without a community node type', async () => {
		const communityNodesStore = mockedStore(useCommunityNodesStore);
		mockIsCommunityPackageName.mockReturnValue(false);

		expect(await useInstalledCommunityPackage().initInstalledPackage()).toBeUndefined();
		expect(
			await useInstalledCommunityPackage('MNI-nodes-base.HttpRequest').initInstalledPackage(),
		).toBeUndefined();
		expect(communityNodesStore.getInstalledPackage).not.toHaveBeenCalled();
	});

	it('updates when the installed package changes', async () => {
		const communityNodesStore = mockedStore(useCommunityNodesStore);
		const installed = communityPackage();
		mockIsCommunityPackageName.mockReturnValue(true);
		communityNodesStore.getInstalledPackage.mockResolvedValue(installed);

		const { installedPackage } = useInstalledCommunityPackage('@test/MNI-nodes-test.TestNode');
		communityNodesStore.installedPackages = {
			'@test/MNI-nodes-test': installed,
		};
		await nextTick();

		expect(installedPackage.value).toStrictEqual(installed);
	});

	it('clears the installed package when the node type changes', async () => {
		const communityNodesStore = mockedStore(useCommunityNodesStore);
		const installed = communityPackage();
		const nodeTypeName = ref('@test/MNI-nodes-test.TestNode');
		mockIsCommunityPackageName.mockReturnValue(true);
		communityNodesStore.getInstalledPackage.mockResolvedValue(installed);
		communityNodesStore.installedPackages = {
			'@test/MNI-nodes-test': installed,
		};

		const { installedPackage, initInstalledPackage } = useInstalledCommunityPackage(nodeTypeName);
		await initInstalledPackage();
		expect(installedPackage.value).toStrictEqual(installed);

		nodeTypeName.value = '@test/MNI-nodes-other.OtherNode';
		await nextTick();

		expect(installedPackage.value).toBeUndefined();
	});
});
