import { BaseRepository, TransactionRunner } from '@MNI/db';
import { Service } from '@MNI/di';
import { DataSource } from '@MNI/typeorm';

import { AgentThreadEntity } from '../entities/agent-thread.entity';

@Service()
export class AgentThreadRepository extends BaseRepository<AgentThreadEntity> {
	constructor(dataSource: DataSource, transactionRunner: TransactionRunner) {
		super(AgentThreadEntity, dataSource.manager, transactionRunner);
	}
}
