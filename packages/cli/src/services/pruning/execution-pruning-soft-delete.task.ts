import { ExecutionsConfig } from '@MNI/config';
import { Time } from '@MNI/constants';
import { intervalFromSeconds, SystemTask } from '@MNI/decorators';
import type { SystemTaskEffects, SystemTaskPlacement, SystemTaskSchedule } from '@MNI/decorators';

import { ExecutionsPruningService } from './executions-pruning.service';

/**
 * Soft-deletes executions past the configured max age or count, marking them
 * for the hard-deletion cycle that removes them and their binary data.
 */
@SystemTask()
export class ExecutionPruningSoftDeleteTask implements SystemTask {
	readonly name = 'execution-pruning-soft-delete';

	readonly schedule: SystemTaskSchedule = intervalFromSeconds(
		this.executionsConfig.pruneDataIntervals.softDelete * Time.minutes.toSeconds,
	);

	readonly effects: SystemTaskEffects = 'idempotent';

	readonly placement: SystemTaskPlacement = { scope: 'cluster', durable: false };

	constructor(
		private readonly executionsConfig: ExecutionsConfig,
		private readonly pruningService: ExecutionsPruningService,
	) {}

	async run(): Promise<void> {
		await this.pruningService.softDelete();
	}
}
