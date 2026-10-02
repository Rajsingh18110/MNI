import { mergeConfig } from 'vitest/config';
import { createVitestConfig } from '@MNI/vitest-config/node';

export default mergeConfig(createVitestConfig(), {});
