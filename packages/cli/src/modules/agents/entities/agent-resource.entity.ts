import { WithTimestamps } from '@MNI/db';
import { Column, Entity, PrimaryColumn } from '@MNI/typeorm';

@Entity({ name: 'agents_resources' })
export class AgentResourceEntity extends WithTimestamps {
	@PrimaryColumn({ type: 'varchar', length: 255 })
	id: string;

	@Column({ type: 'text', nullable: true })
	metadata: string | null;
}
