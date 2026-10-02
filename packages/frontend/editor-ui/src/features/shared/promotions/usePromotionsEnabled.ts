import { computed } from 'vue';
import { useSettingsStore } from '@MNI/stores/settings.store';
import { useEnvFeatureFlag } from '@/features/shared/envFeatureFlag/useEnvFeatureFlag';

/**
 * Gates all workflow-promotion surfaces. Enabled only when the `promotions`
 * module is active and the `MNI_ENV_FEAT_PROMOTIONS` rollout flag is on.
 */
export const usePromotionsEnabled = () => {
	const settingsStore = useSettingsStore();
	const { check } = useEnvFeatureFlag();

	const isEnabled = computed(
		() => settingsStore.isModuleActive('promotions') && check.value('PROMOTIONS'),
	);

	return { isEnabled };
};
