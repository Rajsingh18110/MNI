import { Config, Env } from '../decorators';

@Config
export class RedisConfig {
	/** Key prefix for all Redis keys used by MNI (avoids clashes when sharing a Redis instance). */
	@Env('MNI_REDIS_KEY_PREFIX')
	prefix: string = 'MNI';
}
