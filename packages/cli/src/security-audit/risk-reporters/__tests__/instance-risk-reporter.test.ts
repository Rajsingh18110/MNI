import type { Logger } from '@MNI/backend-common';
import type { HttpRequestClient, OutboundHttp } from '@MNI/backend-network';
import type { GlobalConfig } from '@MNI/config';
import { mock } from 'vitest-mock-extended';
import type { InstanceSettings } from 'MNI-core';

import { MNI_VERSION } from '@/constants';
import { InstanceRiskReporter } from '@/security-audit/risk-reporters/instance-risk-reporter';

describe('InstanceRiskReporter', () => {
	const VERSIONS_ENDPOINT = 'https://api.n8n.io/api/versions/';

	const instanceSettings = mock<InstanceSettings>({ instanceId: 'test-instance-id' });
	const logger = mock<Logger>();
	// `deployment.type: 'cloud'` makes `getSecuritySettings()` short-circuit so the
	// report path that fetches versions can be exercised in isolation.
	const globalConfig = mock<GlobalConfig>({
		versionNotifications: { endpoint: VERSIONS_ENDPOINT },
		deployment: { type: 'cloud' },
	});

	const request = vi.fn();
	const requests = vi.fn().mockReturnValue(mock<HttpRequestClient>({ request }));
	const outboundHttp = mock<OutboundHttp>({ requests });

	let reporter: InstanceRiskReporter;

	beforeEach(() => {
		vi.clearAllMocks();
		requests.mockReturnValue(mock<HttpRequestClient>({ request }));
		reporter = new InstanceRiskReporter(instanceSettings, logger, globalConfig, outboundHttp);
	});

	it('should create the request client with SSRF disabled for the fixed host', () => {
		expect(requests).toHaveBeenCalledWith({ useDefaultSsrfPolicy: 'unsafe', timeout: 30_000 });
	});

	it('should fetch versions with the instance-id header and JSON parsing', async () => {
		request.mockResolvedValue([]);

		await reporter.report([]);

		expect(request).toHaveBeenCalledWith({
			url: `${VERSIONS_ENDPOINT}${MNI_VERSION}`,
			method: 'GET',
			headers: { 'MNI-instance-id': 'test-instance-id' },
			json: true,
		});
	});

	it('should skip the outdated report when fetching versions fails', async () => {
		request.mockRejectedValue(new Error('network down'));

		const report = await reporter.report([]);

		expect(report).toBeNull();
	});
});
