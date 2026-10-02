import type { IWorkflowBase, JsonValue } from 'MNI-workflow';

export interface AbstractEventPayload {
	[key: string]: JsonValue | IWorkflowBase | undefined;
}
