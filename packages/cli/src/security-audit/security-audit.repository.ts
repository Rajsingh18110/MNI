import { Service } from '@MNI/di';
import { DataSource, Repository } from '@MNI/typeorm';

import { InstalledPackages } from '@/modules/community-packages/installed-packages.entity';

@Service()
export class PackagesRepository extends Repository<InstalledPackages> {
	constructor(dataSource: DataSource) {
		super(InstalledPackages, dataSource.manager);
	}
}
