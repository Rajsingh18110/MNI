import type { PushMessage } from '@MNI/api-types';

export type PushMessageQueueItem = {
	message: PushMessage;
	retriesLeft: number;
};
