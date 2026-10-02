import { Service } from '@MNI/di';
import { DataSource, Repository } from '@MNI/typeorm';

import { AgentMemoryEntrySourceEntity } from '../entities/agent-memory-entry-source.entity';

@Service()
export class AgentMemoryEntrySourceRepository extends Repository<AgentMemoryEntrySourceEntity> {
	constructor(dataSource: DataSource) {
		super(AgentMemoryEntrySourceEntity, dataSource.manager);
	}
}
