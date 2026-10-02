import { UnexpectedError } from 'MNI-workflow';

export class UnknownModuleError extends UnexpectedError {
	constructor(moduleName: string) {
		super(`Unknown module "${moduleName}"`, { level: 'fatal' });
	}
}
