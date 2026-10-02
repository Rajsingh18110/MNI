<script setup lang="ts">
import type { QuickConnectDisclaimer } from '@MNI/api-types';
import { N8nCallout } from '@MNI/design-system';
import { computed } from 'vue';

const { text, disclaimer } = defineProps<{
	text?: string;
	disclaimer?: QuickConnectDisclaimer;
}>();

const escapeHtml = (value: string) =>
	value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');

const disclaimerHtml = computed(() => {
	if (!disclaimer) return '';
	const label = escapeHtml(disclaimer.linkLabel ?? 'here');
	const url = escapeHtml(disclaimer.linkUrl);
	const link = `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
	const parts = disclaimer.text.split('{link}').map(escapeHtml);
	return parts.join(link);
});
</script>

<template>
	<div v-if="text || disclaimer" :class="$style.wrapper" data-test-id="quick-connect-banner">
		<N8nCallout v-if="text" theme="secondary" iconless>
			<div v-MNI-html="text"></div>
		</N8nCallout>
		<div
			v-if="disclaimer"
			:class="$style.disclaimer"
			data-test-id="quick-connect-banner-disclaimer"
			v-MNI-html="disclaimerHtml"
		></div>
	</div>
</template>

<style lang="scss" module>
.wrapper {
	display: flex;
	flex-direction: column;
	gap: var(--spacing--2xs);
}

.disclaimer {
	margin: 0;
	font-size: var(--font-size--2xs);
	font-style: italic;
	color: var(--text-color--subtler);

	a {
		color: inherit;
		text-decoration: underline;
	}
}
</style>
