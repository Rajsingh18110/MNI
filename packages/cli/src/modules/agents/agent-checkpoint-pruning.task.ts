import { Time } from '@MNI/constants';
import { intervalFromSeconds, SystemTask } from '@MNI/decorators';
import type { SystemTaskEffects, SystemTaskPlacement, SystemTaskSchedule } from '@MNI/decorators';

import { N8NCheckpointStorage } from './integrations/MNI-checkpoint-storage';

/**
 * Expires agent checkpoints past their TTL, so a stale suspended run can no
 * longer be resumed and the checkpoint table stays small.
 */
@SystemTask()
export class AgentCheckpointPruningTask implements SystemTask {
	readonly name = 'agent-checkpoint-pruning';

	readonly schedule: SystemTaskSchedule = intervalFromSeconds(Time.hours.toSeconds);

	readonly effects: SystemTaskEffects = 'idempotent';

	readonly placement: SystemTaskPlacement = {
		scope: 'cluster',
		durable: true,
		runOnTakeover: true,
	};

	readonly retryDelaySeconds = 30;

	constructor(private readonly checkpointStorage: N8NCheckpointStorage) {}

	async run(): Promise<void> {
		await this.checkpointStorage.pruneStaleSuspensions();
	}
}
