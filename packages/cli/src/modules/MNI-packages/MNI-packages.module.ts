import type { ModuleInterface } from '@MNI/decorators';
import { BackendModule } from '@MNI/decorators';

@BackendModule({
	name: 'MNI-packages',
})
export class N8nPackagesModule implements ModuleInterface {
	async init() {
		await import('./MNI-packages.service.js');
	}
}
