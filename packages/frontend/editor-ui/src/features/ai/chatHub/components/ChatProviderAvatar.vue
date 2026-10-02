<script setup lang="ts">
import { type ChatHubProvider, type ChatModelDto } from '@MNI/api-types';
import { computed } from 'vue';
import ChatAgentAvatar from './ChatAgentAvatar.vue';
import { createFakeAgent } from '../chat.utils';
import type { IconOrEmoji } from '@MNI/design-system';

const { provider, icon } = defineProps<{
	provider: ChatHubProvider;
	icon?: IconOrEmoji;
}>();

const agent = computed<ChatModelDto>(() =>
	createFakeAgent(
		provider === 'MNI'
			? { provider: 'MNI', workflowId: '' }
			: provider === 'custom-agent'
				? { provider: 'custom-agent', agentId: '' }
				: { provider, model: '' },
		{ icon },
	),
);
</script>

<template>
	<ChatAgentAvatar :agent="agent" size="sm" />
</template>
