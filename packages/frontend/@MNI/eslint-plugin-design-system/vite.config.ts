import { defineConfig, mergeConfig } from 'vite';

import { vitestConfig } from '@MNI/vitest-config/node';

export default mergeConfig(defineConfig({}), vitestConfig);
