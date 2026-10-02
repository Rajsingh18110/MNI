import { createVitestConfig } from '@MNI/vitest-config/node';

export default createVitestConfig({
	include: ['**/*.integration.test.ts'],
});
