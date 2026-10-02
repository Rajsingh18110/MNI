import { createVitestConfig } from '@MNI/vitest-config/node';

export default createVitestConfig({
	globalSetup: ['./scripts/vitest-global-setup.ts'],
});
