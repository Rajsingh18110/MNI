import type { Request } from 'express';
import { mock } from 'vitest-mock-extended';

import { OIDC_NONCE_COOKIE_NAME, OIDC_STATE_COOKIE_NAME } from '@/constants';
import { OAUTH_SESSION_COOKIE_NAME } from '@/modules/oauth-server/oauth-session.service';
import { OIDC_ID_TOKEN_COOKIE_NAME } from '@/modules/sso-oidc/constants';
import { OAUTH_BINDING_COOKIE_NAME } from '@/oauth/oauth-browser-binding.service';
import { sanitizeWebhookRequest } from '@/webhooks/webhook-request-sanitizer';

describe('webhookRequestSanitizer', () => {
	let mockRequest: Request;

	beforeEach(() => {
		mockRequest = mock<Request>();
	});

	describe('when no cookies are present', () => {
		it('should call next() without modifying request', () => {
			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBeUndefined();
		});

		it('should handle undefined cookies object', () => {
			(mockRequest.cookies as unknown) = undefined;

			sanitizeWebhookRequest(mockRequest);
		});
	});

	describe('when cookie is present in header', () => {
		it('should remove cookie from cookie header', () => {
			mockRequest.headers = {
				cookie: 'MNI-auth=abc123; other-cookie=value; another-cookie=test',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('other-cookie=value; another-cookie=test');
		});

		it('should remove cookie when it is the only cookie', () => {
			mockRequest.headers = {
				cookie: 'MNI-auth=abc123',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('');
		});

		it('should remove cookie when it is the last cookie', () => {
			mockRequest.headers = {
				cookie: 'other-cookie=value; MNI-auth=abc123',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('other-cookie=value');
		});

		it('should remove cookie when it is in the middle', () => {
			mockRequest.headers = {
				cookie: 'first-cookie=value1; MNI-auth=abc123; last-cookie=value2',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('first-cookie=value1; last-cookie=value2');
		});

		it('should handle multiple MNI-auth cookies', () => {
			mockRequest.headers = {
				cookie: 'MNI-auth=abc123; other-cookie=value; MNI-auth=def456',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('other-cookie=value');
		});

		it('should handle whitespace around cookies', () => {
			mockRequest.headers = {
				cookie: '  MNI-auth=abc123  ;  other-cookie=value  ',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('other-cookie=value');
		});

		it('should not remove cookies that start with MNI-auth but are not exact match', () => {
			mockRequest.headers = {
				cookie: 'MNI-auth-extra=value; other-cookie=value',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('MNI-auth-extra=value; other-cookie=value');
		});
	});

	describe('when cookie is not present in header', () => {
		it('should not modify cookie header when MNI-auth is not present', () => {
			const originalCookie = 'other-cookie=value; another-cookie=test';
			mockRequest.headers = {
				cookie: originalCookie,
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe(originalCookie);
		});

		it('should handle case sensitivity correctly', () => {
			mockRequest.headers = {
				cookie: 'MNI-AUTH=abc123; other-cookie=value',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('MNI-AUTH=abc123; other-cookie=value');
		});
	});

	describe('when cookie is present in parsed cookies', () => {
		it('should remove MNI-auth from parsed cookies object', () => {
			mockRequest.cookies = {
				'MNI-auth': 'abc123',
				'other-cookie': 'value',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.cookies).toEqual({
				'other-cookie': 'value',
			});
		});

		it('should handle when MNI-auth is the only cookie in parsed cookies', () => {
			mockRequest.cookies = {
				'MNI-auth': 'abc123',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.cookies).toEqual({});
		});

		it('should not modify other cookies when MNI-auth is not present in parsed cookies', () => {
			const originalCookies = {
				'other-cookie': 'value',
				'another-cookie': 'test',
			};
			mockRequest.cookies = { ...originalCookies };

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.cookies).toEqual(originalCookies);
		});
	});

	describe('when both header and parsed cookies contain MNI-auth', () => {
		it('should remove MNI-auth from both header and parsed cookies', () => {
			mockRequest.headers = {
				cookie: 'MNI-auth=abc123; other-cookie=value',
			};
			mockRequest.cookies = {
				'MNI-auth': 'abc123',
				'other-cookie': 'value',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('other-cookie=value');
			expect(mockRequest.cookies).toEqual({
				'other-cookie': 'value',
			});
		});
	});

	describe('edge cases', () => {
		it('should handle empty cookie header', () => {
			mockRequest.headers = {
				cookie: '',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('');
		});

		it('should handle cookie header with only whitespace', () => {
			mockRequest.headers = {
				cookie: '   ',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('   ');
		});

		it('should handle cookie header with only semicolons', () => {
			mockRequest.headers = {
				cookie: ';;;',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe(';;;');
		});

		it('should handle malformed cookies without equals sign', () => {
			mockRequest.headers = {
				cookie: 'MNI-auth; other-cookie=value',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('other-cookie=value');
		});
	});

	describe('when MNI-browserId is present in header', () => {
		it('should remove MNI-browserId from cookie header', () => {
			mockRequest.headers = {
				cookie: 'MNI-browserId=abc123; other-cookie=value',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('other-cookie=value');
		});

		it('should remove MNI-browserId from parsed cookies', () => {
			mockRequest.cookies = {
				'MNI-browserId': 'abc123',
				'other-cookie': 'value',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.cookies).toEqual({
				'other-cookie': 'value',
			});
		});

		it('should remove both MNI-auth and MNI-browserId from cookie header', () => {
			mockRequest.headers = {
				cookie: 'MNI-auth=abc123; MNI-browserId=def456; other-cookie=value',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('other-cookie=value');
		});

		it('should remove both MNI-auth and MNI-browserId from parsed cookies', () => {
			mockRequest.cookies = {
				'MNI-auth': 'abc123',
				'MNI-browserId': 'def456',
				'other-cookie': 'value',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.cookies).toEqual({
				'other-cookie': 'value',
			});
		});
	});

	// The form endpoints skip sanitizing for their own node types, so removing these
	// here only affects the webhooks that have no use for them. The form auth cookie
	// names embed the workflow or execution they were minted for, hence the suffixes.
	describe('when the form cookies are present', () => {
		const formCookieNames = [
			'MNI-form-auth-wf-a-workflow-id',
			'MNI-form-auth-ex-12345',
			'MNI-form-oauth',
		];

		it.each(formCookieNames)('should remove %s from the header', (name) => {
			mockRequest.headers = {
				cookie: `${name}=abc123; other-cookie=value`,
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('other-cookie=value');
		});

		it.each(formCookieNames)('should remove %s from parsed cookies', (name) => {
			mockRequest.cookies = {
				[name]: 'abc123',
				'other-cookie': 'value',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.cookies).toEqual({
				'other-cookie': 'value',
			});
		});

		it('should leave an unrelated cookie that merely begins with the prefix', () => {
			mockRequest.headers = {
				cookie: 'MNI-form-authentic=abc123; MNI-form-auth-ex-12345=def',
			};
			mockRequest.cookies = {
				'MNI-form-authentic': 'abc123',
				'MNI-form-auth-ex-12345': 'def',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('MNI-form-authentic=abc123');
			expect(mockRequest.cookies).toEqual({ 'MNI-form-authentic': 'abc123' });
		});

		it('should remove every disallowed cookie in one pass', () => {
			mockRequest.headers = {
				cookie:
					'MNI-auth=a; MNI-browserId=b; MNI-form-auth-ex-12345=c; MNI-form-oauth=d; MNI-chat-oauth=e; MNI-chat-oauth-refresh=f; other-cookie=value',
			};
			mockRequest.cookies = {
				'MNI-auth': 'a',
				'MNI-browserId': 'b',
				'MNI-form-auth-ex-12345': 'c',
				'MNI-form-oauth': 'd',
				'MNI-chat-oauth': 'e',
				'MNI-chat-oauth-refresh': 'f',
				'other-cookie': 'value',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('other-cookie=value');
			expect(mockRequest.cookies).toEqual({ 'other-cookie': 'value' });
		});
	});

	describe('cookies MNI issues for its own flows', () => {
		const MNI_ISSUED_COOKIES = [
			OAUTH_SESSION_COOKIE_NAME,
			OAUTH_BINDING_COOKIE_NAME,
			OIDC_ID_TOKEN_COOKIE_NAME,
			OIDC_STATE_COOKIE_NAME,
			OIDC_NONCE_COOKIE_NAME,
		];

		it.each(MNI_ISSUED_COOKIES)('should remove %s from the cookie header', (name) => {
			mockRequest.headers = { cookie: `${name}=abc123; other-cookie=value` };

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('other-cookie=value');
		});

		it.each(MNI_ISSUED_COOKIES)('should remove %s from the parsed cookies', (name) => {
			mockRequest.cookies = { [name]: 'abc123', 'other-cookie': 'value' };

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.cookies).toEqual({ 'other-cookie': 'value' });
		});
	});

	// The chat endpoints skip sanitizing for their own node type, so the hosted page
	// still receives these. Every other webhook must not see them — the `-refresh` one
	// carries a 30-day credential.
	describe('when the chat cookies are present', () => {
		const chatCookieNames = ['MNI-chat-oauth', 'MNI-chat-oauth-refresh'];

		it.each(chatCookieNames)('should remove %s from the header', (name) => {
			mockRequest.headers = {
				cookie: `${name}=abc123; other-cookie=value`,
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.headers.cookie).toBe('other-cookie=value');
		});

		it.each(chatCookieNames)('should remove %s from parsed cookies', (name) => {
			mockRequest.cookies = {
				[name]: 'abc123',
				'other-cookie': 'value',
			};

			sanitizeWebhookRequest(mockRequest);

			expect(mockRequest.cookies).toEqual({
				'other-cookie': 'value',
			});
		});
	});
});
