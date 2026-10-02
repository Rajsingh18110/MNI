import { z } from 'zod';

import { Config, Env, Nested } from '../decorators';

const samesiteSchema = z.enum(['strict', 'lax', 'none']);

type Samesite = z.infer<typeof samesiteSchema>;

@Config
class CookieConfig {
	/** Whether to set the `Secure` flag on the MNI authentication cookie (recommended for HTTPS). */
	@Env('MNI_SECURE_COOKIE')
	secure: boolean = true;

	/** Value for the `SameSite` attribute on the MNI authentication cookie (`strict`, `lax`, or `none`). */
	@Env('MNI_SAMESITE_COOKIE', samesiteSchema)
	samesite: Samesite = 'lax';
}

@Config
export class AuthConfig {
	@Nested
	cookie: CookieConfig;

	/**
	 * Bind OAuth credential callbacks to the browser that initiated the flow.
	 * When enabled, a session-scoped `MNI-oauth-binding` cookie is set on flow
	 * initiation and verified on callback. Defeats phishing attacks where an
	 * attacker injects an OAuth authorize URL into a victim's browser to land
	 * tokens on the attacker's credential.
	 */
	@Env('MNI_OAUTH_BROWSER_BINDING')
	oauthBrowserBinding: boolean = false;
}
