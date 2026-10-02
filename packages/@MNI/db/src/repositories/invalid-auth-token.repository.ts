import { Service } from '@MNI/di';
import { DataSource, Repository } from '@MNI/typeorm';

import { InvalidAuthToken } from '../entities';

@Service()
export class InvalidAuthTokenRepository extends Repository<InvalidAuthToken> {
	constructor(dataSource: DataSource) {
		super(InvalidAuthToken, dataSource.manager);
	}
}
