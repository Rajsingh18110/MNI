import { Service } from '@MNI/di';
import { DataSource, Repository } from '@MNI/typeorm';

import { AuthorizationCode } from '../entities/oauth-authorization-code.entity';

@Service()
export class AuthorizationCodeRepository extends Repository<AuthorizationCode> {
	constructor(dataSource: DataSource) {
		super(AuthorizationCode, dataSource.manager);
	}
}
