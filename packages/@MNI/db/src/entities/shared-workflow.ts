import { WorkflowSharingRole } from '@MNI/permissions';
import { Column, Entity, ManyToOne, PrimaryColumn } from '@MNI/typeorm';

import { WithTimestamps } from './abstract-entity';
import { Project } from './project';
import { WorkflowEntity } from './workflow-entity';

@Entity()
export class SharedWorkflow extends WithTimestamps {
	@Column({ type: 'varchar' })
	role: WorkflowSharingRole;

	@ManyToOne('WorkflowEntity', 'shared')
	workflow: WorkflowEntity;

	@PrimaryColumn()
	workflowId: string;

	@ManyToOne('Project', 'sharedWorkflows')
	project: Project;

	@PrimaryColumn()
	projectId: string;
}
