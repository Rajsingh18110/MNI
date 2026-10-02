import { Service } from '@MNI/di';
import { DataSource, Repository } from '@MNI/typeorm';

import { InstalledNodes } from './installed-nodes.entity';

@Service()
export class InstalledNodesRepository extends Repository<InstalledNodes> {
	constructor(dataSource: DataSource) {
		super(InstalledNodes, dataSource.manager);
	}
}
