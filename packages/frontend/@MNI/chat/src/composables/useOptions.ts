import { inject } from 'vue';

import { ChatOptionsSymbol } from '@MNI/chat/constants';
import type { ChatOptions } from '@MNI/chat/types';

export function useOptions() {
	const options = inject(ChatOptionsSymbol) as ChatOptions;

	return {
		options,
	};
}
