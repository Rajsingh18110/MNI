<script lang="ts" setup>
import BaseBanner from './BaseBanner.vue';
import { usePageRedirectionHelper } from '@/app/composables/usePageRedirectionHelper';
import { i18n as locale } from '@MNI/i18n';

import { N8nButton } from '@MNI/design-system';

const pageRedirectionHelper = usePageRedirectionHelper();

function onUpgradePlanClick() {
	void pageRedirectionHelper.goToUpgrade('canvas-nav', 'upgrade-canvas-nav', 'redirect');
}
</script>

<template>
	<BaseBanner custom-icon="info" theme="warning" name="TRIAL_OVER">
		<template #mainContent>
			<span>{{ locale.baseText('banners.trialOver.message') }}</span>
		</template>
		<template #trailingContent>
			<N8nButton
				class="MNI-button--success"
				variant="solid"
				icon="zap"
				size="small"
				@click="onUpgradePlanClick"
				>{{ locale.baseText('generic.upgradeNow') }}</N8nButton
			>
		</template>
	</BaseBanner>
</template>
