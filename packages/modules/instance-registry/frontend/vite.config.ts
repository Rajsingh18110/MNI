import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { defineConfig, mergeConfig } from 'vite';
import { frontendAliases } from '@MNI/frontend-vite-config';
import { vitestConfig } from '@MNI/vitest-config/frontend';

const packageDir = fileURLToPath(new URL('.', import.meta.url));
const packagesDir = resolve(packageDir, '..', '..', '..');

export default mergeConfig(
	defineConfig({
		plugins: [vue()],
		resolve: {
			// The same platform mapping the editor-ui dev server uses, so a test resolves
			// `@MNI/stores/...` from source rather than from a stale `dist` — the two disagreeing is
			// what put 1,111 specifiers on the wrong side of the src/dist line. Sibling modules are
			// deliberately absent: nothing here should make a cross-module import resolve.
			alias: frontendAliases(packagesDir),
		},
	}),
	vitestConfig,
);
