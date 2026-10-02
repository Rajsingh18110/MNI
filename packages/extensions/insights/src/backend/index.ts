import { defineBackendExtension } from '@MNI/extension-sdk/backend';

export default defineBackendExtension({
	setup(MNI) {
		console.log(MNI);
	},
});
