import type { EpisodicMemoryStatus, JSONObject } from '@MNI/agents';
import { DateTimeColumn, JsonColumn, WithTimestampsAndStringId } from '@MNI/db';
import { Column, Entity, Index } from '@MNI/typeorm';

@Entity({ name: 'agents_memory_entries' })
@Index(['agentId', 'resourceId', 'status', 'createdAt', 'id'])
@Index(['agentId', 'resourceId', 'contentHash'], { unique: true })
@Index(['resourceId'])
@Index(['supersededBy'])
export class AgentMemoryEntryEntity extends WithTimestampsAndStringId {
	@Column({ type: 'varchar', length: 36 })
	agentId: string;

	@Column({ type: 'varchar', length: 255 })
	resourceId: string;

	@Column({ type: 'text' })
	content: string;

	@Column({ type: 'varchar', length: 64 })
	contentHash: string;

	@Column({ type: 'varchar', length: 16 })
	status: EpisodicMemoryStatus;

	@Column({ type: 'varchar', length: 36, nullable: true })
	supersededBy: string | null;

	@Column({ type: 'varchar', length: 128, nullable: true })
	embeddingModel: string | null;

	@JsonColumn({ nullable: true })
	embedding: number[] | null;

	@JsonColumn({ nullable: true })
	metadata: JSONObject | null;

	@DateTimeColumn()
	lastSeenAt: Date;
}
