import type { InstanceAiLivenessSurface, InstanceAiLivenessTimeoutReason } from '@MNI/instance-ai';

export type InstanceAiRunTimeoutDetails = {
	reason: InstanceAiLivenessTimeoutReason;
	surface: InstanceAiLivenessSurface;
	timeoutMs: number;
	elapsedMs: number;
	idleMs: number;
};
