import { Service } from '@MNI/di';
import { DataSource, Repository } from '@MNI/typeorm';

import { TrustedKeySourceEntity } from '../entities/trusted-key-source.entity';

@Service()
export class TrustedKeySourceRepository extends Repository<TrustedKeySourceEntity> {
	constructor(dataSource: DataSource) {
		super(TrustedKeySourceEntity, dataSource.manager);
	}
}
