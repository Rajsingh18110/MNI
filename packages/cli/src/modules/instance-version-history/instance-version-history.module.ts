import type { ModuleInterface } from '@MNI/decorators';
import { BackendModule } from '@MNI/decorators';
import { Container } from '@MNI/di';

@BackendModule({ name: 'instance-version-history', instanceTypes: ['main'] })
export class InstanceVersionHistoryModule implements ModuleInterface {
	async init() {
		await import('./instance-version-history.controller.js');

		const { InstanceVersionHistoryService } = await import('./instance-version-history.service.js');
		await Container.get(InstanceVersionHistoryService).init();
	}

	async entities() {
		const { InstanceVersionHistory } = await import(
			'./database/entities/instance-version-history.entity.js'
		);
		return [InstanceVersionHistory];
	}
}
