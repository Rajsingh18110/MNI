import { Service } from '@MNI/di';
import { DataSource, Repository } from '@MNI/typeorm';

import { AgentObservationEntity } from '../entities/agent-observation.entity';

@Service()
export class AgentObservationRepository extends Repository<AgentObservationEntity> {
	constructor(dataSource: DataSource) {
		super(AgentObservationEntity, dataSource.manager);
	}
}
