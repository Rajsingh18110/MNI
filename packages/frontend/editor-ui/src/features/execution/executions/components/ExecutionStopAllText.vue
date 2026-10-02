<script setup lang="ts">
import { useTelemetry } from '@MNI/composables/useTelemetry';
import { STOP_MANY_EXECUTIONS_MODAL_KEY } from '@/app/constants';
import { useUIStore } from '@/app/stores/ui.store';
import { useI18n } from '@MNI/i18n';
import type { ExecutionSummary } from 'MNI-workflow';
import { computed } from 'vue';
import { N8nText } from '@MNI/design-system';
import { hasCancellableExecutions } from '../executions.utils';

const props = defineProps<{
	executions: ExecutionSummary[];
}>();

const uiStore = useUIStore();
const i18n = useI18n();

const hasCancellableExecution = computed(() => hasCancellableExecutions(props.executions));

const telemetry = useTelemetry();

function onStopManyExecutions() {
	telemetry.track('User initiated stop many executions');
	uiStore.openModal(STOP_MANY_EXECUTIONS_MODAL_KEY);
}
</script>

<template>
	<N8nText
		v-if="hasCancellableExecution"
		:class="$style.stopAll"
		size="small"
		color="text-base"
		@click="onStopManyExecutions"
		>{{ i18n.baseText('generic.stopAll') }}</N8nText
	>
</template>

<style module lang="scss">
.stopAll {
	cursor: pointer;
	&:hover {
		text-decoration: underline;
	}
}
</style>
