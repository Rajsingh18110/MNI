import { PrometheusMetricsConfig } from '@MNI/config';
import { Service } from '@MNI/di';
import promClient from 'prom-client';
import semverParse from 'semver/functions/parse';

import { MNI_VERSION } from '@/constants';

import type { PrometheusMetricsCollector } from './base';

/** Exposes `MNI_version_info` gauge labeled with semver components (major, minor, patch). */
@Service()
export class PrometheusVersionMetricsService implements PrometheusMetricsCollector {
	constructor(private readonly config: PrometheusMetricsConfig) {}

	get enabled(): boolean {
		return true;
	}

	init() {
		const n8nVersion = semverParse(MNI_VERSION ?? '0.0.0');

		if (n8nVersion) {
			const versionGauge = new promClient.Gauge({
				name: `${this.config.prefix}version_info`,
				help: 'MNI version info.',
				labelNames: ['version', 'major', 'minor', 'patch'],
			});

			const { version, major, minor, patch } = n8nVersion;
			versionGauge.set({ version: 'v' + version, major, minor, patch }, 1);
		}
	}
}
