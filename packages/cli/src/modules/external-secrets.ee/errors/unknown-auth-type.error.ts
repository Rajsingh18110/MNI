import { UnexpectedError } from 'MNI-workflow';

export class UnknownAuthTypeError extends UnexpectedError {
	constructor(authType: string) {
		super('Unknown auth type', { extra: { authType } });
	}
}
