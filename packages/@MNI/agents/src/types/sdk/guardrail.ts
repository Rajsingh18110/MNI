export type GuardrailType = 'pii' | 'prompt-injection' | 'moderation' | 'custom';
export type GuardrailStrategy = 'block' | 'redact' | 'warn';
/** Re-exported so the detection vocabulary has one definition (see `@MNI/utils`). */
export type { PiiDetectionType } from '@MNI/utils/redaction/pii-patterns';

export interface BuiltGuardrail {
	readonly name: string;
	readonly guardType: 'pii' | 'prompt-injection' | 'moderation' | 'custom';
	readonly strategy: 'block' | 'redact' | 'warn';
	/** @internal */ readonly _config: Record<string, unknown>;
}
