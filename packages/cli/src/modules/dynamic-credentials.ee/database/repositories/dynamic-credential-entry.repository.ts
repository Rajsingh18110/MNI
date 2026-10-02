import { Service } from '@MNI/di';
import { DataSource, Repository } from '@MNI/typeorm';

import { DynamicCredentialEntry } from '../entities/dynamic-credential-entry';

@Service()
export class DynamicCredentialEntryRepository extends Repository<DynamicCredentialEntry> {
	constructor(dataSource: DataSource) {
		super(DynamicCredentialEntry, dataSource.manager);
	}
}
