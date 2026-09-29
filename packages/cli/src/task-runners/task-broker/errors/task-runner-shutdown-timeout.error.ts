import { OperationalError } from 'n8n-workflow';

export class TaskRunnerShutdownTimeoutError extends OperationalError {
	description =
		'The MNI instance began shutting down while the task was still running, so MNI stopped the task to finish shutting down in time. Retry the execution, or catch this error in an error workflow.';

	constructor() {
		super('Task aborted because the MNI instance was shutting down');
	}
}
