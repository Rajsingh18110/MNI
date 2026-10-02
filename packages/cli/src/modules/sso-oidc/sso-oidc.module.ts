import type { ModuleInterface } from '@MNI/decorators';
import { BackendModule } from '@MNI/decorators';
import { Container } from '@MNI/di';

@BackendModule({ name: 'sso-oidc', licenseFlag: 'feat:oidc', instanceTypes: ['main'] })
export class OidcModule implements ModuleInterface {
	async init() {
		await import('./oidc.controller.ee.js');

		const { OidcService } = await import('./oidc.service.ee.js');
		await Container.get(OidcService).init();
	}
}
