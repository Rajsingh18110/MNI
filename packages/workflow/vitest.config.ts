import { defineConfig } from 'vitest/config';
import { createBaseInlineConfig } from '@MNI/vitest-config/node';

const { reporters, outputFile, ...sharedTestConfig } = createBaseInlineConfig({
	include: ['test/**/*.test.ts'],
	setupFiles: ['./test/setup-vm-evaluator.ts'],
});

export default defineConfig({
	test: {
		reporters,
		outputFile,
		projects: [
			{
				test: {
					...sharedTestConfig,
					name: 'vm-engine',
					env: { MNI_EXPRESSION_ENGINE: 'vm' },
				},
			},
			{
				test: {
					...sharedTestConfig,
					name: 'legacy-engine',
					env: { MNI_EXPRESSION_ENGINE: 'legacy' },
				},
			},
			{
				test: {
					...sharedTestConfig,
					name: 'quickjs-engine',
					env: { MNI_EXPRESSION_ENGINE: 'quickjs' },
				},
			},
		],
	},
});
