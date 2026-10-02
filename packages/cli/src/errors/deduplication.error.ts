import { UnexpectedError } from 'MNI-workflow';

export class DeduplicationError extends UnexpectedError {
	constructor(message: string) {
		super(`Deduplication Failed: ${message}`);
	}
}
