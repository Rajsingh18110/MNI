import { Service } from '@MNI/di';
import { DataSource, Repository } from '@MNI/typeorm';

import { ExecutionAnnotation } from '../entities';

@Service()
export class ExecutionAnnotationRepository extends Repository<ExecutionAnnotation> {
	constructor(dataSource: DataSource) {
		super(ExecutionAnnotation, dataSource.manager);
	}
}
