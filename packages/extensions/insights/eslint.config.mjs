import { defineConfig, globalIgnores } from 'eslint/config';
import { baseConfig } from '@MNI/eslint-config/base';

export default defineConfig(baseConfig, globalIgnores(['src/shims.d.ts']));
