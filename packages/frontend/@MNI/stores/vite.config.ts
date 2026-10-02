import { defineConfig, mergeConfig } from 'vite';
import { vitestConfig } from '@MNI/vitest-config/frontend';

export default mergeConfig(defineConfig({}), vitestConfig);
