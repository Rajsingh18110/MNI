import { LicenseState } from '@MNI/backend-common';
import { createTeamProject, createWorkflow, testDb, testModules } from '@MNI/backend-test-utils';
import type { User } from '@MNI/db';
import { WorkflowRepository } from '@MNI/db';
import { Container } from '@MNI/di';
import { GROUP_DESCRIPTION_MAX_LENGTH, jsonParse } from 'MNI-workflow';

import { createOwner } from '@test-integration/db/users';
import { LicenseMocker } from '@test-integration/license';
import { initNodeTypes } from '@test-integration/utils';

import { N8nPackagesService } from '../MNI-packages.service';
import type { ImportPackageRequest } from '../MNI-packages.types';
import { importPackageRequest } from './fixtures/import-request';
import { buildImportPackageBuffer, serializedWorkflow } from './fixtures/package-fixtures';
import { readExport, streamToBuffer } from './utils/tar-support';

let service: N8nPackagesService;
let workflowRepository: WorkflowRepository;

const licenseMocker = new LicenseMocker();

const nodes = [
	{
		id: 'manual-trigger',
		name: 'Manual Trigger',
		type: 'MNI-nodes-base.manualTrigger',
		typeVersion: 1,
		position: [0, 0] as [number, number],
		parameters: {},
	},
	{
		id: 'set-node',
		name: 'Set',
		type: 'MNI-nodes-base.set',
		typeVersion: 3.4,
		position: [200, 0] as [number, number],
		parameters: {},
	},
	{
		id: 'set-node-2',
		name: 'Set 2',
		type: 'MNI-nodes-base.set',
		typeVersion: 3.4,
		position: [400, 0] as [number, number],
		parameters: {},
	},
];

const groups = [
	{ id: 'group-1', name: 'Shape', nodeIds: ['set-node'], description: 'Shapes the payload' },
	{ id: 'group-2', name: 'Enrich', nodeIds: ['set-node-2'] },
];

beforeAll(async () => {
	await testModules.loadModules(['MNI-packages']);
	await testDb.init();
	await initNodeTypes();
	licenseMocker.mockLicenseState(Container.get(LicenseState));
	service = Container.get(N8nPackagesService);
	workflowRepository = Container.get(WorkflowRepository);
});

afterAll(async () => {
	await testDb.terminate();
});

beforeEach(async () => {
	await testDb.truncate(['WorkflowEntity', 'SharedWorkflow', 'ProjectRelation', 'Project']);
});

type ImportParams = { user: User; packageBuffer: Buffer } & Partial<
	Omit<ImportPackageRequest, 'user' | 'packageBuffer'>
>;

async function importPackage(params: ImportParams) {
	return await service.importPackage(
		importPackageRequest({ variableParentPolicy: 'project', ...params }),
	);
}

describe('workflow package export — node groups', () => {
	it('writes the workflow node groups into workflow.json', async () => {
		const owner = await createOwner();
		const project = await createTeamProject('Project A', owner);
		const workflow = await createWorkflow(
			{ name: 'Grouped workflow', nodes, connections: {}, nodeGroups: groups },
			project,
		);

		const { stream } = await service.exportPackage({ user: owner, workflowIds: [workflow.id] });
		const { manifest, entries } = await readExport(stream);

		const file = entries.find(
			(entry) => entry.name === `${manifest.workflows![0].target}/workflow.json`,
		);
		const serialized = jsonParse<Record<string, unknown>>(file!.content.toString());

		expect(serialized.nodeGroups).toEqual(groups);
	});

	it('omits nodeGroups for a workflow without groups', async () => {
		const owner = await createOwner();
		const project = await createTeamProject('Project A', owner);
		const workflow = await createWorkflow(
			{ name: 'Ungrouped workflow', nodes, connections: {} },
			project,
		);

		const { stream } = await service.exportPackage({ user: owner, workflowIds: [workflow.id] });
		const { manifest, entries } = await readExport(stream);

		const file = entries.find(
			(entry) => entry.name === `${manifest.workflows![0].target}/workflow.json`,
		);
		const serialized = jsonParse<Record<string, unknown>>(file!.content.toString());

		expect(serialized).not.toHaveProperty('nodeGroups');
	});
});

describe('workflow package import — node groups', () => {
	it('restores node groups on the imported workflow', async () => {
		const owner = await createOwner();
		const project = await createTeamProject('Project A', owner);
		const source = await createWorkflow(
			{ name: 'Grouped workflow', nodes, connections: {}, nodeGroups: groups },
			project,
		);

		const { stream } = await service.exportPackage({ user: owner, workflowIds: [source.id] });
		const packageBuffer = await streamToBuffer(stream);

		const importer = await createOwner();
		const result = await importPackage({ user: importer, packageBuffer });

		const imported = await workflowRepository.findOneByOrFail({
			id: result.workflows[0].localId,
		});
		expect(imported.nodeGroups).toEqual(groups);
	});

	it('imports without groups when the package predates node groups', async () => {
		const owner = await createOwner();

		const result = await importPackage({
			user: owner,
			packageBuffer: await buildImportPackageBuffer([
				serializedWorkflow({ id: 'wf-legacy', name: 'Legacy workflow' }),
			]),
		});

		const imported = await workflowRepository.findOneByOrFail({
			id: result.workflows[0].localId,
		});
		expect(imported.nodeGroups).toEqual([]);
	});

	it('drops only the groups that reference nodes the workflow does not have, keeping the rest', async () => {
		const owner = await createOwner();

		const result = await importPackage({
			user: owner,
			packageBuffer: await buildImportPackageBuffer([
				serializedWorkflow({
					id: 'wf-broken-groups',
					name: 'Workflow with broken groups',
					nodes,
					nodeGroups: [
						{ id: 'group-1', name: 'Ingest', nodeIds: ['node-that-is-not-here'] },
						{ id: 'group-2', name: 'Shape', nodeIds: ['set-node'] },
					],
				}),
			]),
		});

		const imported = await workflowRepository.findOneByOrFail({
			id: result.workflows[0].localId,
		});
		expect(imported.nodeGroups).toEqual([{ id: 'group-2', name: 'Shape', nodeIds: ['set-node'] }]);
	});

	it('drops groups that break a canvas grouping rule, keeping the import', async () => {
		const owner = await createOwner();

		const result = await importPackage({
			user: owner,
			packageBuffer: await buildImportPackageBuffer([
				serializedWorkflow({
					id: 'wf-trigger-group',
					name: 'Workflow grouping a trigger',
					nodes,
					nodeGroups: [{ id: 'group-1', name: 'Ingest', nodeIds: ['manual-trigger'] }],
				}),
			]),
		});

		const imported = await workflowRepository.findOneByOrFail({
			id: result.workflows[0].localId,
		});
		expect(imported.nodeGroups).toEqual([]);
	});

	it('truncates an over-long group description instead of rejecting the package', async () => {
		const owner = await createOwner();

		const result = await importPackage({
			user: owner,
			packageBuffer: await buildImportPackageBuffer([
				serializedWorkflow({
					id: 'wf-long-description',
					name: 'Workflow with a chatty group',
					nodes,
					nodeGroups: [
						{ id: 'group-1', name: 'Shape', nodeIds: ['set-node'], description: 'x'.repeat(200) },
					],
				}),
			]),
		});

		const imported = await workflowRepository.findOneByOrFail({
			id: result.workflows[0].localId,
		});
		expect(imported.nodeGroups[0].description).toHaveLength(GROUP_DESCRIPTION_MAX_LENGTH);
	});
});
