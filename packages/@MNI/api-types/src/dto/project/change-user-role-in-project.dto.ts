import { assignableProjectRoleSchema } from '@MNI/permissions';

import { Z } from '../../zod-class';

export class ChangeUserRoleInProject extends Z.class({
	role: assignableProjectRoleSchema,
}) {}
