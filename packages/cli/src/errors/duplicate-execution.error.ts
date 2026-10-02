import { OperationalError } from 'MNI-workflow';

export class DuplicateExecutionError extends OperationalError {
	constructor(
		readonly deduplicationKey: string,
		cause?: Error,
	) {
		super(`Execution with deduplication key "${deduplicationKey}" already exists`, {
			cause,
		});
	}
}
