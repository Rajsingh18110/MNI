import { WorkflowRepository } from '@MNI/db';
import { Service } from '@MNI/di';
import { UserError, type IWorkflowBase, type IWorkflowLoader } from 'MNI-workflow';

@Service()
export class WorkflowLoaderService implements IWorkflowLoader {
	constructor(private readonly workflowRepository: WorkflowRepository) {}

	async get(workflowId: string): Promise<IWorkflowBase> {
		const workflow = await this.workflowRepository.findById(workflowId);

		if (!workflow) {
			throw new UserError(`Failed to find workflow with ID "${workflowId}"`);
		}

		return workflow;
	}
}
