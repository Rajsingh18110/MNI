import { runMemoryBaseline } from './memory-baseline';
import { test } from '../../fixtures/base';

test.use({
	capability: {
		services: ['victoriaLogs', 'victoriaMetrics', 'vector'],
		env: {
			MNI_ENABLED_MODULES: 'agents',
			MNI_AI_ANTHROPIC_KEY: 'fake-key',
		},
	},
});

runMemoryBaseline({ name: 'agents', owner: 'AI' });
