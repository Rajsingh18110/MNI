import { BUILDER_CHECKPOINT_UNAVAILABLE_CODE, BUILDER_NOT_CONFIGURED_CODE } from '@MNI/api-types';
import { UserError } from 'MNI-workflow';

/**
 * Stable code on `BuilderNotConfiguredError` so callers that can't import
 * the class (e.g. instance AI's `build-agent.tool.ts`) can detect the
 * unconfigured state by matching the thrown error's `code`.
 */
export class BuilderNotConfiguredError extends UserError {
	readonly code = BUILDER_NOT_CONFIGURED_CODE;

	constructor() {
		super(
			'Agent builder is not configured. An admin must select a provider and credential, or configure the MNI AI assistant proxy.',
		);
	}
}

export class BuilderCheckpointUnavailableError extends UserError {
	readonly code = BUILDER_CHECKPOINT_UNAVAILABLE_CODE;

	constructor(reason: 'expired' | 'not-found') {
		super(
			reason === 'expired'
				? 'The builder question this answer belongs to has expired and can no longer be resumed.'
				: 'The builder question this answer belongs to no longer exists.',
		);
	}
}
