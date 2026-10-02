import { Service } from '@MNI/di';
import { DataSource, Repository } from '@MNI/typeorm';

import { AuthIdentity } from '../entities';

@Service()
export class AuthIdentityRepository extends Repository<AuthIdentity> {
	constructor(dataSource: DataSource) {
		super(AuthIdentity, dataSource.manager);
	}
}
