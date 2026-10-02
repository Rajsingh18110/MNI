import { Service } from '@MNI/di';
import { DataSource, Repository } from '@MNI/typeorm';

import { AnnotationTagEntity } from '../entities';

@Service()
export class AnnotationTagRepository extends Repository<AnnotationTagEntity> {
	constructor(dataSource: DataSource) {
		super(AnnotationTagEntity, dataSource.manager);
	}
}
