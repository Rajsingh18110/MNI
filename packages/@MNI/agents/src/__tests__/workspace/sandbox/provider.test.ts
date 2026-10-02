import {
	DEFAULT_SANDBOX_PROVIDER,
	isSandboxProvider,
	normalizeSandboxProvider,
} from '../../../workspace/sandbox/provider';

describe('normalizeSandboxProvider', () => {
	it('returns MNI-sandbox for undefined', () => {
		expect(normalizeSandboxProvider(undefined)).toBe('MNI-sandbox');
	});

	it('returns MNI-sandbox for empty string', () => {
		expect(normalizeSandboxProvider('')).toBe('MNI-sandbox');
	});

	it('returns MNI-sandbox for valid MNI-sandbox value', () => {
		expect(normalizeSandboxProvider('MNI-sandbox')).toBe('MNI-sandbox');
	});

	it('returns daytona for valid daytona value', () => {
		expect(normalizeSandboxProvider('daytona')).toBe('daytona');
	});

	it('returns MNI-sandbox for unrecognized value', () => {
		expect(normalizeSandboxProvider('bad-value')).toBe('MNI-sandbox');
	});
});

describe('isSandboxProvider', () => {
	it('returns true for daytona', () => {
		expect(isSandboxProvider('daytona')).toBe(true);
	});

	it('returns false for bad value', () => {
		expect(isSandboxProvider('bad-value')).toBe(false);
	});
});

describe('DEFAULT_SANDBOX_PROVIDER', () => {
	it('is MNI-sandbox', () => {
		expect(DEFAULT_SANDBOX_PROVIDER).toBe('MNI-sandbox');
	});
});
