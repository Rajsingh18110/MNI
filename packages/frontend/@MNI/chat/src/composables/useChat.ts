import { inject } from 'vue';

import { ChatSymbol } from '@MNI/chat/constants';
import type { Chat } from '@MNI/chat/types';

export function useChat() {
	return inject(ChatSymbol) as Chat;
}
