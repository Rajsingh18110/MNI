import { defineBackendExtension } from '@n8n/extension-sdk/backend';

export default defineBackendExtension({
	setup(MNI) {
		console.log(MNI);
	},
});
