import { Config, Env } from '@MNI/config';

@Config
export class PushConfig {
	/** Backend to use for push notifications */
	@Env('MNI_PUSH_BACKEND')
	backend: 'sse' | 'websocket' = 'websocket';
}
