import { ModelStreamStallError } from '@MNI/agents';
import { isDnsFailure, isTransportFailure } from '@MNI/backend-network';
import { isQuotaExhaustedError } from '@MNI/instance-ai';

/**
 * True when a run died because the connection to the model provider broke.
 *
 * A `ModelStreamStallError` is a dead connection detected by silence instead of a socket error.
 * Quota is checked first: hitting the credit wall at the model call also dies
 * as a transport failure, which `QuotaExhaustedStreamError` keeps as its
 * `cause`. DNS is excluded so a misconfigured `baseURL` stays visible.
 */
export function isStreamTransportError(error: unknown): boolean {
	return (
		!isQuotaExhaustedError(error) &&
		(error instanceof ModelStreamStallError || (!isDnsFailure(error) && isTransportFailure(error)))
	);
}
