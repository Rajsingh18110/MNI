import { Service } from '@MNI/di';
import { DataSource, Repository } from '@MNI/typeorm';

import { RoleMappingRule } from '../entities';

@Service()
export class RoleMappingRuleRepository extends Repository<RoleMappingRule> {
	constructor(dataSource: DataSource) {
		super(RoleMappingRule, dataSource.manager);
	}
}
