import { defineConfig, globalIgnores } from 'eslint/config';
import { backendConfig } from '@MNI/eslint-config/backend';

export default defineConfig(backendConfig, globalIgnores(['dist/**']));
