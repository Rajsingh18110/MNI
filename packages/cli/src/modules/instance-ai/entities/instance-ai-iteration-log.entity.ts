import { WithTimestamps } from '@MNI/db';
import { Column, Entity, Index, PrimaryColumn } from '@MNI/typeorm';

@Entity({ name: 'instance_ai_iteration_logs' })
@Index(['threadId', 'taskKey', 'createdAt'])
export class InstanceAiIterationLog extends WithTimestamps {
	@PrimaryColumn({ type: 'varchar', length: 36 })
	id: string;

	@Column({ type: 'uuid' })
	threadId: string;

	@Column({ type: 'varchar' })
	taskKey: string;

	@Column({ type: 'text' })
	entry: string;
}
