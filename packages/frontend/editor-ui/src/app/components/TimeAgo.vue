<script lang="ts" setup>
import { N8nTimeAgo } from '@MNI/design-system';
import { useRootStore } from '@MNI/stores/useRootStore';

type Props = {
	date: string;
	capitalize?: boolean;
	live?: boolean;
};

withDefaults(defineProps<Props>(), {
	capitalize: false,
	live: false,
});

const rootStore = useRootStore();
</script>

<template>
	<N8nTimeAgo
		:date="date"
		:capitalize="capitalize"
		:locale="rootStore.defaultLocale"
		:live="live"
	/>
</template>
