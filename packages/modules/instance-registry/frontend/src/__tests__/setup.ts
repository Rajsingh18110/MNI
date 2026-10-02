// The shared jsdom harness — observers, matchMedia, canvas, timers, teardown guards.
import '@MNI/vitest-config/setup/frontend';

import { createPinia, setActivePinia } from 'pinia';
import { beforeEach } from 'vitest';

// Framework boot stays per-package on purpose: `@MNI/i18n` devDepends on
// `@MNI/vitest-config`, so booting i18n from inside the shared harness would
// close a turbo build cycle. Add `useI18n` boot here if this module needs it.
beforeEach(() => {
	setActivePinia(createPinia());
});
