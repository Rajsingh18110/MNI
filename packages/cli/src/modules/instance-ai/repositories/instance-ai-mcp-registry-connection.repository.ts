import { Service } from '@MNI/di';
import { DataSource, Repository } from '@MNI/typeorm';

import { InstanceAiMcpRegistryConnection } from '../entities/instance-ai-mcp-registry-connection.entity';

@Service()
export class InstanceAiMcpRegistryConnectionRepository extends Repository<InstanceAiMcpRegistryConnection> {
	constructor(dataSource: DataSource) {
		super(InstanceAiMcpRegistryConnection, dataSource.manager);
	}
}
