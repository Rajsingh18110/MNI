import { randomName } from '@MNI/backend-test-utils';
import type { Folder, Project, TagEntity } from '@MNI/db';
import { FolderRepository } from '@MNI/db';
import { Container } from '@MNI/di';

export const createFolder = async (
	project: Project,
	options: {
		name?: string;
		parentFolder?: Folder;
		tags?: TagEntity[];
		updatedAt?: Date;
		createdAt?: Date;
	} = {},
) => {
	const folderRepository = Container.get(FolderRepository);
	const folder = await folderRepository.save(
		folderRepository.create({
			name: options.name ?? randomName(),
			homeProject: project,
			parentFolder: options.parentFolder ?? null,
			tags: options.tags ?? [],
			updatedAt: options.updatedAt ?? new Date(),
			createdAt: options.createdAt ?? options.updatedAt ?? new Date(),
		}),
	);

	return folder;
};
