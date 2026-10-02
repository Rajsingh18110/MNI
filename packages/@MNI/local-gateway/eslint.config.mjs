import { defineConfig, globalIgnores } from 'eslint/config';
import { backendConfig } from '@MNI/eslint-config/backend';

export default defineConfig(
	globalIgnores(['electron-builder.config.js', 'scripts/**']),
	backendConfig,
);
