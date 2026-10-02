import type { ModuleInterface } from '@MNI/decorators';
import { BackendModule } from '@MNI/decorators';
import { Container } from '@MNI/di';

@BackendModule({
	name: 'source-control',
	licenseFlag: 'feat:sourceControl',
	instanceTypes: ['main'],
})
export class SourceControlModule implements ModuleInterface {
	async init() {
		await import('./source-control.controller.ee.js');

		const { SourceControlService } = await import('./source-control.service.ee.js');
		await Container.get(SourceControlService).start();
	}
}
