import { Time } from '@MNI/constants';
import { z } from 'zod';

import { Config, Env, Nested } from '../decorators';

const cacheBackendSchema = z.enum(['memory', 'redis', 'auto']);
type CacheBackend = z.infer<typeof cacheBackendSchema>;

@Config
class MemoryConfig {
	/** Maximum size of the in-memory cache in bytes. Default: 3 MiB. */
	@Env('MNI_CACHE_MEMORY_MAX_SIZE')
	maxSize: number = 3 * 1024 * 1024; // 3 MiB

	/** Time to live in milliseconds for entries in the memory cache. Default: 1 hour. */
	@Env('MNI_CACHE_MEMORY_TTL')
	ttl: number = 1 * Time.hours.toMilliseconds;
}

@Config
class RedisConfig {
	/** Key prefix for cache entries stored in Redis. */
	@Env('MNI_CACHE_REDIS_KEY_PREFIX')
	prefix: string = 'cache';

	/** Time to live in milliseconds for Redis cache entries. Set to 0 to disable expiry. Default: 1 hour. */
	@Env('MNI_CACHE_REDIS_TTL')
	ttl: number = 1 * Time.hours.toMilliseconds;
}

@Config
export class CacheConfig {
	/** Cache backend: `memory`, `redis`, or `auto` (choose based on deployment). */
	@Env('MNI_CACHE_BACKEND', cacheBackendSchema)
	backend: CacheBackend = 'auto';

	@Nested
	memory: MemoryConfig;

	@Nested
	redis: RedisConfig;
}
