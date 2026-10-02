import type { WorkflowEntity } from '@MNI/db';

export interface RequirementsExtractor<TRequirement> {
	extract(workflow: WorkflowEntity): TRequirement[];
}
