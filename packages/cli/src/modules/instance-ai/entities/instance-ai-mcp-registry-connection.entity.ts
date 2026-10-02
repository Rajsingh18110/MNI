import { JsonColumn, WithTimestamps } from '@MNI/db';
import { Column, Entity, Index, PrimaryColumn } from '@MNI/typeorm';

export type InstanceAiMcpToolFilter = {
	mode: 'allow' | 'exclude';
	tools: string[];
};

@Entity({ name: 'instance_ai_mcp_registry_connections' })
@Index(['userId', 'serverSlug', 'credentialId'], { unique: true })
export class InstanceAiMcpRegistryConnection extends WithTimestamps {
	@PrimaryColumn('uuid')
	id: string;

	@Column({ type: 'uuid' })
	userId: string;

	@Column({ type: 'varchar', length: 255 })
	serverSlug: string;

	@Column({ type: 'varchar', length: 36 })
	credentialId: string;

	@JsonColumn({ nullable: true })
	toolFilter: InstanceAiMcpToolFilter | null;
}
