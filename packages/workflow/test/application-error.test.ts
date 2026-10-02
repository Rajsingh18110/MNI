import { ApplicationError as ErrorsApplicationError } from '@MNI/errors';

import { ApplicationError } from '../src';

// This file is the compatibility boundary, exempt from the `no-application-error` lint rule.
describe('ApplicationError compatibility shim', () => {
	it('exposes the same class from `MNI-workflow` and `@MNI/errors`', () => {
		expect(ApplicationError).toBe(ErrorsApplicationError);
	});

	it('keeps the deprecated `ApplicationError` constructor behavior', () => {
		const error = new ApplicationError('boom', {
			tags: { foo: 'bar' },
			extra: { baz: 1 },
		});

		expect(error).toBeInstanceOf(Error);
		expect(error.message).toBe('boom');
		expect(error.level).toBe('error'); // default level
		expect(error.tags).toMatchObject({ foo: 'bar' });
		expect(error.extra).toEqual({ baz: 1 });
	});

	it('honors an explicit level', () => {
		expect(new ApplicationError('x', { level: 'warning' }).level).toBe('warning');
	});
});
