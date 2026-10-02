import { Service } from '@MNI/di';
import { DataSource, Repository } from '@MNI/typeorm';

import { InstanceAiIterationLog } from '../entities/instance-ai-iteration-log.entity';

@Service()
export class InstanceAiIterationLogRepository extends Repository<InstanceAiIterationLog> {
	constructor(dataSource: DataSource) {
		super(InstanceAiIterationLog, dataSource.manager);
	}
}
