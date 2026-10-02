import { UserRepository } from '@MNI/db';
import { Service } from '@MNI/di';

import { RoleService } from '@/services/role.service';

@Service()
export class AgentPushRecipientsService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly roleService: RoleService,
	) {}

	async getProjectReaders(projectId: string): Promise<string[]> {
		const [globalRoleSlugs, projectRoleSlugs] = await Promise.all([
			this.roleService.rolesWithScope('global', ['agent:read']),
			this.roleService.rolesWithScope('project', ['agent:read']),
		]);
		return await this.userRepository.findIdsWithGlobalOrProjectRoles({
			projectIds: [projectId],
			projectRoleSlugs,
			globalRoleSlugs,
		});
	}
}
