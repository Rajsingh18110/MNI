import { useCloudPlanStore } from '@MNI/stores/cloudPlan.store';
import { useSettingsStore } from '@MNI/stores/settings.store';
import { useUsersStore } from '@MNI/stores/users.store';
import { useEmptyStateDetection } from '@/features/workflows/readyToRun/composables/useEmptyStateDetection';
import { computed } from 'vue';

export function useSurfaceMcpToNewCloudUsersEligibility() {
	const usersStore = useUsersStore();
	const { isTrulyEmpty } = useEmptyStateDetection();
	const settingsStore = useSettingsStore();
	const cloudPlanStore = useCloudPlanStore();

	const isEligible = computed(
		() =>
			settingsStore.isCloudDeployment &&
			cloudPlanStore.userIsTrialing &&
			usersStore.isAdminOrOwner &&
			isTrulyEmpty(),
	);

	return {
		isEligible,
	};
}
