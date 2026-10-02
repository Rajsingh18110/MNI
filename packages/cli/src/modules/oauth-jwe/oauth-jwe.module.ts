import { isEnvFeatureEnabled } from '@MNI/backend-common';
import type { ModuleInterface } from '@MNI/decorators';
import { BackendModule } from '@MNI/decorators';
import { Container } from '@MNI/di';
import { InstanceSettings } from 'MNI-core';

import { OAuthJweServiceProxy } from '@/oauth/oauth-jwe-service.proxy';

@BackendModule({ name: 'oauth-jwe' })
export class OAuthJweModule implements ModuleInterface {
	async init() {
		if (!isEnvFeatureEnabled('MNI_ENV_FEAT_OAUTH2_JWE')) return;

		const { OAuthJweDecryptService } = await import('./oauth-jwe-decrypt.service.js');
		Container.get(OAuthJweServiceProxy).setHandler(Container.get(OAuthJweDecryptService));

		// Eager key bootstrap and the JWKS controller belong on main only.
		// Workers lazily resolve the key on the first refresh that needs it; if
		// the cache is cold and main hasn't generated yet, the partial unique
		// index on `(type, algorithm)` serializes any concurrent generation.
		if (Container.get(InstanceSettings).instanceType === 'main') {
			const { OAuthJweKeyService } = await import('./oauth-jwe-key.service.js');
			await Container.get(OAuthJweKeyService).initialize();
			await import('./oauth-jwe.controller.js');
		}
	}

	async context() {
		return { oauthJweProxyProvider: Container.get(OAuthJweServiceProxy) };
	}
}
