import { testDb } from '@MNI/backend-test-utils';
import { FolderRepository } from '@MNI/db';
import { Container } from '@MNI/di';

const SQLITE_MAX_BIND_PARAMETERS = 32_766;

describe('FolderRepository', () => {
	beforeAll(async () => {
		await testDb.init();
	});

	afterAll(async () => {
		await testDb.terminate();
	});

	it('resolves subtree ids beyond the SQLite bind-parameter limit', async () => {
		const folderIds = Array.from(
			{ length: SQLITE_MAX_BIND_PARAMETERS + 1 },
			(_, index) => `folder-${index}`,
		);

		await expect(
			Container.get(FolderRepository).getAllFolderIdsInSubtrees(folderIds),
		).resolves.toEqual([]);
	});
});
