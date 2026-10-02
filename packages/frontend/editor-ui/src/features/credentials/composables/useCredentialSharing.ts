import { computed } from 'vue';
import { useSettingsStore } from '@MNI/stores/settings.store';

/**
 * Gates the granular credential sharing surfaces: a personal credential is
 * usable in any project its owner works in, so the picker has to say where each
 * credential comes from. Follows `MNI_ENV_FEAT_CRED_SHARING` on the backend.
 */
export const useCredentialSharing = () => {
	const settingsStore = useSettingsStore();

	const isEnabled = computed(() => settingsStore.settings.granularCredentialSharing === true);

	return { isEnabled };
};
