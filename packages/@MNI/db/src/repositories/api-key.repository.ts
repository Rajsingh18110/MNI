import { Service } from '@MNI/di';
import { DataSource, Repository } from '@MNI/typeorm';

import { ApiKey } from '../entities';

@Service()
export class ApiKeyRepository extends Repository<ApiKey> {
	constructor(dataSource: DataSource) {
		super(ApiKey, dataSource.manager);
	}
}
