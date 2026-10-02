import { Service } from '@MNI/di';
import { DataSource, Repository } from '@MNI/typeorm';

import { AgentMemoryEntryEntity } from '../entities/agent-memory-entry.entity';

@Service()
export class AgentMemoryEntryRepository extends Repository<AgentMemoryEntryEntity> {
	constructor(dataSource: DataSource) {
		super(AgentMemoryEntryEntity, dataSource.manager);
	}
}
