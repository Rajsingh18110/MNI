import { Service } from '@MNI/di';
import { DataSource, Repository } from '@MNI/typeorm';

import { InstanceVersionHistory } from '../entities/instance-version-history.entity';

@Service()
export class InstanceVersionHistoryRepository extends Repository<InstanceVersionHistory> {
	constructor(dataSource: DataSource) {
		super(InstanceVersionHistory, dataSource.manager);
	}
}
