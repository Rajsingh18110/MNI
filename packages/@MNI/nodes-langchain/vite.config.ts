import { defineConfig, mergeConfig } from 'vitest/config';
import { vitestConfig } from '@MNI/vitest-config/node';
import path from 'node:path';

export default mergeConfig(
	vitestConfig,
	defineConfig({
		test: {
			setupFiles: ['./test/setup.ts'],
		},
		resolve: {
			alias: {
				'@utils': path.resolve(__dirname, './utils'),
				'@nodes-testing': path.resolve(__dirname, '../../core/nodes-testing'),
				// Pin MNI-workflow to its CJS build so the single module instance is shared
				// across CJS-required workspace deps and ESM-imported test code.
				// `require.resolve` follows the `require` export condition (the CJS dist).
				'MNI-workflow': require.resolve('MNI-workflow'),
			},
		},
	}),
);
