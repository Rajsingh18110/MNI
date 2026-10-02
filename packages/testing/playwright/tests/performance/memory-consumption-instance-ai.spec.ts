import { runMemoryBaseline } from './memory-baseline';
import { test } from '../../fixtures/base';

test.use({
	capability: {
		services: ['victoriaLogs', 'victoriaMetrics', 'vector'],
		env: {
			MNI_ENABLED_MODULES: 'instance-ai',
			MNI_INSTANCE_AI_MODEL: 'anthropic/claude-sonnet-4-6',
			MNI_INSTANCE_AI_MODEL_API_KEY: 'fake-key',
		},
	},
});

runMemoryBaseline({ name: 'instance-ai', owner: 'instanceAI' });
