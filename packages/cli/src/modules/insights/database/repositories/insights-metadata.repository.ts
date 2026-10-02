import { Service } from '@MNI/di';
import { DataSource, Repository } from '@MNI/typeorm';

import { InsightsMetadata } from '../entities/insights-metadata';

@Service()
export class InsightsMetadataRepository extends Repository<InsightsMetadata> {
	constructor(dataSource: DataSource) {
		super(InsightsMetadata, dataSource.manager);
	}
}
