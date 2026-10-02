import type { WorkflowEntity } from '@MNI/db';
import { Service } from '@MNI/di';

import type { WorkflowTagUsage } from './tag.types';
import type { RequirementsExtractor } from '../requirements-extractor';

@Service()
export class TagRequirementsExtractor implements RequirementsExtractor<WorkflowTagUsage> {
	extract(workflow: WorkflowEntity): WorkflowTagUsage[] {
		return (workflow.tags ?? []).map((tag) => ({
			workflowId: workflow.id,
			tag: { id: tag.id, name: tag.name },
		}));
	}
}
