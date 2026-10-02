import { Service } from '@MNI/di';
import { DataSource, Repository } from '@MNI/typeorm';

import { AgentObservationCursorEntity } from '../entities/agent-observation-cursor.entity';

@Service()
export class AgentObservationCursorRepository extends Repository<AgentObservationCursorEntity> {
	constructor(dataSource: DataSource) {
		super(AgentObservationCursorEntity, dataSource.manager);
	}
}
