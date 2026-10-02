import { mergeConfig } from 'vite';
import { createVitestConfigWithDecorators } from '@MNI/vitest-config/node-decorators';
import path from 'node:path';

export default mergeConfig(
	createVitestConfigWithDecorators(
		{
			globalSetup: ['./test/setup.ts'],
			setupFiles: ['./test/setup-mocks.ts'],
		},
		// Pin `zod` and `MNI-workflow` to their CJS build so cross-boundary `instanceof`
		// (`ZodType`, `UserError`) holds against the externalized CJS dist. See
		// `cjsPinAliases` in @MNI/vitest-config/node for the rationale.
		{ pinCjs: ['zod', 'MNI-workflow'] },
	),
	{
		resolve: {
			alias: [
				{ find: '@', replacement: path.resolve(__dirname, './src') },
				{ find: '@test', replacement: path.resolve(__dirname, './test') },
			],
		},
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
