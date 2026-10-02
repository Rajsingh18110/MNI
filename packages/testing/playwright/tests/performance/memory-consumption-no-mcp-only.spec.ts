import { runMemoryBaseline } from './memory-baseline';
import { test } from '../../fixtures/base';

test.use({
	capability: {
		services: ['victoriaLogs', 'victoriaMetrics', 'vector'],
		env: {
			MNI_DISABLED_MODULES: 'mcp',
		},
	},
});

runMemoryBaseline({ name: 'no-mcp-only', owner: 'AI' });
