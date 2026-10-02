<script lang="ts" setup>
import hljs from 'highlight.js/lib/core';
import hljsJavascript from 'highlight.js/lib/languages/javascript';
import hljsXML from 'highlight.js/lib/languages/xml';
import { computed, onMounted } from 'vue';

import Chat from '@MNI/chat/components/Chat.vue';
import ChatWindow from '@MNI/chat/components/ChatWindow.vue';
import { useOptions } from '@MNI/chat/composables';

defineProps({});

const { options } = useOptions();

const isFullscreen = computed<boolean>(() => options.mode === 'fullscreen');

onMounted(() => {
	hljs.registerLanguage('xml', hljsXML);
	hljs.registerLanguage('javascript', hljsJavascript);
});
</script>
<template>
	<Chat v-if="isFullscreen" class="MNI-chat" />
	<ChatWindow v-else class="MNI-chat" />
</template>
