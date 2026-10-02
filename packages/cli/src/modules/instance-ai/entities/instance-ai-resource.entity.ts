import { WithTimestamps, JsonColumn } from '@MNI/db';
import { Column, Entity, PrimaryColumn } from '@MNI/typeorm';

@Entity({ name: 'instance_ai_resources' })
export class InstanceAiResource extends WithTimestamps {
	@PrimaryColumn({ type: 'varchar', length: 255 })
	id: string;

	@Column({ type: 'text', nullable: true })
	workingMemory: string | null;

	@JsonColumn({ nullable: true })
	metadata: Record<string, unknown> | null;
}
