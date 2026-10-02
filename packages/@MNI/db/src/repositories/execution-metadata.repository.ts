import { Service } from '@MNI/di';
import { DataSource, Repository } from '@MNI/typeorm';

import { ExecutionMetadata } from '../entities';

@Service()
export class ExecutionMetadataRepository extends Repository<ExecutionMetadata> {
	constructor(dataSource: DataSource) {
		super(ExecutionMetadata, dataSource.manager);
	}
}
