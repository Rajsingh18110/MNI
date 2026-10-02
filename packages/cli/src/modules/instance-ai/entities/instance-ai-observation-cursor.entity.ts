import { DateTimeColumn, WithTimestamps } from '@MNI/db';
import { Column, Entity, PrimaryColumn } from '@MNI/typeorm';

@Entity({ name: 'instance_ai_observation_cursors' })
export class InstanceAiObservationCursor extends WithTimestamps {
	@PrimaryColumn({ type: 'uuid' })
	observationScopeId: string;

	@Column({ type: 'varchar', length: 36 })
	lastObservedMessageId: string;

	@DateTimeColumn()
	lastObservedAt: Date;
}
