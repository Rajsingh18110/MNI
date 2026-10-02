import { Service } from '@MNI/di';
import { DataSource, Repository } from '@MNI/typeorm';

import { EventDestinations } from '../entities';

@Service()
export class EventDestinationsRepository extends Repository<EventDestinations> {
	constructor(dataSource: DataSource) {
		super(EventDestinations, dataSource.manager);
	}
}
