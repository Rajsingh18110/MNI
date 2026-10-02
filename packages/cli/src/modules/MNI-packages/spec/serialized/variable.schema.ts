import { variableTypeSchema, variableValueSchema } from '@MNI/api-types';
import { z } from 'zod';

export const serializedVariableSchema = z
	.object({
		name: z.string().min(1),
		type: variableTypeSchema,
		value: variableValueSchema.optional(),
	})
	.strict();

export type SerializedVariable = z.infer<typeof serializedVariableSchema>;
