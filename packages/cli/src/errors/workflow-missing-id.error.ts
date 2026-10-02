import type { Workflow, IWorkflowBase } from 'MNI-workflow';
import { UnexpectedError } from 'MNI-workflow';

export class WorkflowMissingIdError extends UnexpectedError {
	constructor(workflow: Workflow | IWorkflowBase) {
		super('Detected ID-less worklfow', { extra: { workflow } });
	}
}
