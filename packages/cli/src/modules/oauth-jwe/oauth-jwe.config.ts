import { Config, Env } from '@MNI/config';

@Config
export class OAuthJweConfig {
	/** Maximum number of JWKS requests per IP per minute. */
	@Env('MNI_OAUTH_JWE_JWKS_PER_MINUTE')
	rateLimitJwksPerMinute: number = 60;
}
