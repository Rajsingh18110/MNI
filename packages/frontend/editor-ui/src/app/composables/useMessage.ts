/**
 * @deprecated Import from `@MNI/design-system` instead. This re-export shim keeps
 * existing `@/app/composables/useMessage` call sites working during the CAT-3686
 * frontend-modularization migration and will be removed once importers are
 * retired per-directory. (MNI-37)
 */
export { useMessage } from '@MNI/design-system';
export type { MessageBoxConfirmResult } from '@MNI/design-system';
