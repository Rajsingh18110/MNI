import type { TelemetryEventDef } from '@MNI/telemetry';
import type { GenericValue } from 'MNI-workflow';

export type BuilderTrackFn = (
	entry: TelemetryEventDef,
	properties: Record<string, GenericValue>,
) => void;
