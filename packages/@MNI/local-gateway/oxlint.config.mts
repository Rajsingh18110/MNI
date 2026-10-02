import { backendConfig } from '@MNI/oxlint-config/backend';
import { defineConfig } from 'oxlint';

export default defineConfig({
	extends: [backendConfig],
	options: { typeAware: true },
	ignorePatterns: ['electron-builder.config.js', 'scripts/**'],
});
