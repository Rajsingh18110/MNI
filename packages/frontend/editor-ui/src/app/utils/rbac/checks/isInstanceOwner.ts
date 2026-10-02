import { useUsersStore } from '@MNI/stores/users.store';
import type { DefaultUserMiddlewareOptions, RBACPermissionCheck } from '@/app/types/rbac';

export const isInstanceOwner: RBACPermissionCheck<DefaultUserMiddlewareOptions> = () =>
	useUsersStore().isInstanceOwner;
