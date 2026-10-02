import { UserError } from 'MNI-workflow';

export class WorkerMissingEncryptionKey extends UserError {
	constructor() {
		super(
			[
				'Failed to start worker because of missing encryption key.',
				'Please set the `MNI_ENCRYPTION_KEY` env var when starting the worker.',
				'See: https://docs.n8n.io/hosting/configuration/configuration-examples/encryption-key/',
			].join(' '),
		);
	}
}
