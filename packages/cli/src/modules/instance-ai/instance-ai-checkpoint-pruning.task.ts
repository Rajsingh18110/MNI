import { InstanceAiConfig } from '@MNI/config';
import { intervalFromMilliseconds, SystemTask } from '@MNI/decorators';
import type { SystemTaskEffects, SystemTaskPlacement, SystemTaskSchedule } from '@MNI/decorators';

import { InstanceAiService } from './instance-ai.service';

/**
 * Expires stale Instance AI checkpoints, hard-deletes their tombstones past
 * the GC horizon, and drops expired pending confirmations and conversation
 * threads, so suspended-run state does not pile up forever.
 */
@SystemTask()
export class InstanceAiCheckpointPruningTask implements SystemTask {
	readonly name = 'instance-ai-checkpoint-pruning';

	readonly schedule: SystemTaskSchedule = intervalFromMilliseconds(
		this.instanceAiConfig.pruneInterval,
	);

	readonly effects: SystemTaskEffects = 'idempotent';

	readonly placement: SystemTaskPlacement = {
		scope: 'cluster',
		durable: true,
		runOnTakeover: true,
	};

	readonly retryDelaySeconds = 30;

	constructor(
		private readonly instanceAiConfig: InstanceAiConfig,
		private readonly instanceAiService: InstanceAiService,
	) {}

	async run(signal: AbortSignal): Promise<void> {
		await this.instanceAiService.pruneExpiredData(Date.now(), signal);
	}
}
