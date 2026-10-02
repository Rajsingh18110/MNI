import { Service } from '@MNI/di';
import { DataSource, Repository } from '@MNI/typeorm';

import { InstanceAiObservationLock } from '../entities/instance-ai-observation-lock.entity';

@Service()
export class InstanceAiObservationLockRepository extends Repository<InstanceAiObservationLock> {
	constructor(dataSource: DataSource) {
		super(InstanceAiObservationLock, dataSource.manager);
	}
}
