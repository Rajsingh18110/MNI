<script setup lang="ts">
const props = defineProps<{
	params: {
		value: string;
	};
}>();
</script>

<template>
	<span class="MNI-empty-value">{{ props.params.value }}</span>
</template>

<style lang="scss">
.MNI-empty-value {
	font-style: italic;
	color: var(--color--text);
}
</style>
