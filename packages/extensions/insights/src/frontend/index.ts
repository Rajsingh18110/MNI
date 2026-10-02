import { markRaw } from 'vue';
import { defineFrontendExtension } from '@MNI/extension-sdk/frontend';
import InsightsDashboard from './InsightsDashboard.vue';

export default defineFrontendExtension({
	setup(MNI) {
		n8n.registerComponent('InsightsDashboard', markRaw(InsightsDashboard));
	},
});
