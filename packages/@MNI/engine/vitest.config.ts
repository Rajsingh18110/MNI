import { createVitestConfig } from '@MNI/vitest-config/node';

export default createVitestConfig({
	exclude: ['**/node_modules/**', '**/dist/**', '**/*.integration.test.ts'],
});
