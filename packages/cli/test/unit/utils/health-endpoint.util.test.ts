import type { GlobalConfig } from '@MNI/config';

import {
	resolveBackendHealthEndpointPath,
	resolveFrontendHealthEndpointPath,
} from '@/utils/health-endpoint.util';

describe('resolveBackendHealthEndpointPath', () => {
	it('should always return bare health endpoint regardless of MNI_PATH', () => {
		const mockGlobalConfig = {
			path: '/MNI',
			endpoints: { health: '/healthz' },
		} as GlobalConfig;

		expect(resolveBackendHealthEndpointPath(mockGlobalConfig)).toBe('/healthz');
	});

	it('should return custom health endpoint when configured', () => {
		const mockGlobalConfig = {
			path: '/MNI',
			endpoints: { health: '/custom/health' },
		} as GlobalConfig;

		expect(resolveBackendHealthEndpointPath(mockGlobalConfig)).toBe('/custom/health');
	});
});

describe('resolveFrontendHealthEndpointPath', () => {
	let originalEnv: NodeJS.ProcessEnv;

	beforeEach(() => {
		originalEnv = { ...process.env };
	});

	afterEach(() => {
		process.env = originalEnv;
	});

	it('should return default health endpoint when MNI_PATH is /', () => {
		const mockGlobalConfig = {
			path: '/',
			endpoints: { health: '/healthz' },
		} as GlobalConfig;
		delete process.env.MNI_ENDPOINT_HEALTH;

		expect(resolveFrontendHealthEndpointPath(mockGlobalConfig)).toBe('/healthz');
	});

	it('should combine MNI_PATH with health endpoint when MNI_PATH is set', () => {
		const mockGlobalConfig = {
			path: '/MNI',
			endpoints: { health: '/healthz' },
		} as GlobalConfig;
		delete process.env.MNI_ENDPOINT_HEALTH;

		expect(resolveFrontendHealthEndpointPath(mockGlobalConfig)).toBe('/MNI/healthz');
	});

	it('should normalize double slashes when MNI_PATH has trailing slash', () => {
		const mockGlobalConfig = {
			path: '/MNI/',
			endpoints: { health: '/healthz' },
		} as GlobalConfig;
		delete process.env.MNI_ENDPOINT_HEALTH;

		expect(resolveFrontendHealthEndpointPath(mockGlobalConfig)).toBe('/MNI/healthz');
	});

	it('should prioritize MNI_ENDPOINT_HEALTH over MNI_PATH', () => {
		const mockGlobalConfig = {
			path: '/MNI',
			endpoints: { health: '/custom/health' },
		} as GlobalConfig;
		process.env.MNI_ENDPOINT_HEALTH = '/custom/health';

		expect(resolveFrontendHealthEndpointPath(mockGlobalConfig)).toBe('/custom/health');
	});

	it('should use MNI_ENDPOINT_HEALTH even when it is the default value', () => {
		const mockGlobalConfig = {
			path: '/MNI',
			endpoints: { health: '/healthz' },
		} as GlobalConfig;
		process.env.MNI_ENDPOINT_HEALTH = '/healthz';

		expect(resolveFrontendHealthEndpointPath(mockGlobalConfig)).toBe('/healthz');
	});

	it('should handle multiple path segments in MNI_PATH', () => {
		const mockGlobalConfig = {
			path: '/api/MNI',
			endpoints: { health: '/healthz' },
		} as GlobalConfig;
		delete process.env.MNI_ENDPOINT_HEALTH;

		expect(resolveFrontendHealthEndpointPath(mockGlobalConfig)).toBe('/api/MNI/healthz');
	});

	it('should handle custom health endpoint with MNI_PATH', () => {
		const mockGlobalConfig = {
			path: '/MNI',
			endpoints: { health: '/health/check' },
		} as GlobalConfig;
		delete process.env.MNI_ENDPOINT_HEALTH;

		expect(resolveFrontendHealthEndpointPath(mockGlobalConfig)).toBe('/MNI/health/check');
	});
});
