import { Service } from '@MNI/di';
import { DataSource, Repository } from '@MNI/typeorm';

import { InstanceAiObservation } from '../entities/instance-ai-observation.entity';

@Service()
export class InstanceAiObservationRepository extends Repository<InstanceAiObservation> {
	constructor(dataSource: DataSource) {
		super(InstanceAiObservation, dataSource.manager);
	}

	/** Live observations for a thread, oldest first. Superseded and dropped rows are
	 *  excluded: they are no longer what the agent remembers. */
	async findActiveForThread(threadId: string): Promise<InstanceAiObservation[]> {
		return await this.find({
			where: { observationScopeId: threadId, status: 'active' },
			order: { createdAt: 'ASC', id: 'ASC' },
		});
	}
}
