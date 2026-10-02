import { mergeConfig } from 'vite';
import { createVitestConfigWithDecorators } from '@MNI/vitest-config/node-decorators';

export default mergeConfig(
	createVitestConfigWithDecorators(
		{},
		// Pin `zod` and `MNI-workflow` to their CJS build so cross-boundary `instanceof`
		// (`ZodType`, `UnexpectedError`) holds against the externalized CJS dist. See
		// `cjsPinAliases` in @MNI/vitest-config/node for the rationale.
		{ pinCjs: ['zod', 'MNI-workflow'] },
	),
	{
		oxc: {
			// OXC's TS transform ignores tsconfig's `emitDecoratorMetadata` — must be enabled
			// explicitly here so `@MNI/config`'s `@Env(name, zodSchema) field: z.infer<...>`
			// pattern works (the decorator reads `design:type` via `Reflect.getMetadata`).
			decorator: {
				legacy: true,
				emitDecoratorMetadata: true,
			},
		},
	},
);
