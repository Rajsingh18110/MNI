import { Service } from '@MNI/di';
import { DataSource, Repository } from '@MNI/typeorm';

import { DynamicCredentialResolver } from '../entities/credential-resolver';

@Service()
export class DynamicCredentialResolverRepository extends Repository<DynamicCredentialResolver> {
	constructor(dataSource: DataSource) {
		super(DynamicCredentialResolver, dataSource.manager);
	}
}
