import { StatisticsNames, type WorkflowStatistics } from '@MNI/db';
import { WorkflowStatisticsRepository } from '@MNI/db';
import { Container } from '@MNI/di';
import type { Workflow } from 'MNI-workflow';

export async function createWorkflowStatisticsItem(
	workflowId: Workflow['id'],
	data?: Partial<WorkflowStatistics>,
) {
	const entity = Container.get(WorkflowStatisticsRepository).create({
		count: 0,
		latestEvent: new Date().toISOString(),
		name: StatisticsNames.manualSuccess,
		...(data ?? {}),
		workflowId,
	});

	await Container.get(WorkflowStatisticsRepository).insert(entity);

	return entity;
}
