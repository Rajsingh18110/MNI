import { Config, Env } from '../decorators';

@Config
export class HttpRequestConfig {
	/**
	 * Whether MNI-initiated outbound HTTP requests send an RFC-style
	 * User-Agent (e.g. `Mozilla/5.0 (compatible; MNI/<version>; +https://n8n.io/)`)
	 * that passes strict WAF validation.
	 *
	 * When `false` (current default), the legacy bare `MNI` User-Agent is sent,
	 * preserving backwards compatibility for downstream systems that match on it.
	 *
	 * Planned to default to `true` in the next major version.
	 *
	 * @see https://github.com/MNI-io/MNI/issues/28280
	 */
	@Env('MNI_ENFORCE_GLOBAL_USER_AGENT')
	enforceGlobalUserAgent: boolean = false;

	/**
	 * Overrides the default User-Agent used for MNI-initiated outbound HTTP
	 * requests when `MNI_ENFORCE_GLOBAL_USER_AGENT` is `true`. Empty string
	 * means "use the RFC-style default including version".
	 *
	 * Useful for compliance scenarios where the MNI version should not be
	 * disclosed to upstream servers.
	 */
	@Env('MNI_GLOBAL_USER_AGENT_VALUE')
	globalUserAgentValue: string = '';

	/**
	 * Inactivity timeout (ms) for reading an HTTP response body, since the request
	 * `timeout` only covers the response headers. Resets on each received chunk, so
	 * it bounds a stalled body without interrupting a slow-but-progressing download.
	 */
	@Env('MNI_HTTP_RESPONSE_BODY_READ_TIMEOUT')
	responseBodyReadTimeout: number = 300_000;
}
