<script setup lang="ts">
import { useI18n } from '@MNI/i18n';
import { N8nTooltip } from '@MNI/design-system';

const i18n = useI18n();
</script>

<template>
	<N8nTooltip placement="top">
		<template #content>
			{{ i18n.baseText('dataTable.cell.oversized.tooltip') }}
		</template>
		<span class="MNI-oversized-value">{{ i18n.baseText('dataTable.cell.oversized') }}</span>
	</N8nTooltip>
</template>

<style lang="scss">
.MNI-oversized-value {
	font-style: italic;
	color: var(--color--warning);
}
</style>
