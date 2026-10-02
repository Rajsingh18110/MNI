import { PrometheusMetricsConfig } from '@MNI/config';
import { Service } from '@MNI/di';
import promClient from 'prom-client';

import { CacheService } from '@/services/cache/cache.service';

import type { PrometheusMetricsCollector } from './base';

/**
 * Tracks cache hit, miss, and update counts by subscribing to CacheService events.
 * Registers: `MNI_cache_hits_total`, `MNI_cache_misses_total`, `MNI_cache_updates_total`.
 */
@Service()
export class PrometheusCacheMetricsService implements PrometheusMetricsCollector {
	constructor(
		private readonly cacheService: CacheService,
		private readonly config: PrometheusMetricsConfig,
	) {}

	get enabled(): boolean {
		return this.config.includeCacheMetrics;
	}

	init() {
		this.initializeCounter('metrics.cache.hit', 'hits');
		this.initializeCounter('metrics.cache.miss', 'misses');
		this.initializeCounter('metrics.cache.update', 'updates');
	}

	private initializeCounter(eventName: Parameters<CacheService['on']>[0], kind: string) {
		const counter = new promClient.Counter({
			name: `${this.config.prefix}cache_${kind}_total`,
			help: `Total number of cache ${kind}.`,
		});
		counter.inc(0);
		this.cacheService.on(eventName, () => counter.inc(1));
	}
}
