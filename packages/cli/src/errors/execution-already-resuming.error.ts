import { OperationalError } from 'MNI-workflow';

export class ExecutionAlreadyResumingError extends OperationalError {
	constructor(executionId: string) {
		super('Execution is already being resumed by another process', { extra: { executionId } });
	}
}
