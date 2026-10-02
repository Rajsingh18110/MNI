import { DataSource, EntityManager, type EntityMetadata } from '@MNI/typeorm';
import type { Class } from 'MNI-core';
import { mock } from 'vitest-mock-extended';

import { mockInstance } from './mock-instance';

export const mockEntityManager = (entityClass: Class) => {
	const entityManager = mockInstance(EntityManager);
	const dataSource = mockInstance(DataSource, {
		manager: entityManager,
		getMetadata: () => mock<EntityMetadata>({ target: entityClass }),
	});
	Object.assign(entityManager, { connection: dataSource });
	return entityManager;
};
