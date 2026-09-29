import { MANUAL_TRIGGER_NODE_NAME } from '../../../config/constants';
import { expect, test } from '../../../fixtures/base';
import type { n8nPage } from '../../../pages/n8nPage';
import { type GitRepoHelper, setupGitRepo } from '../../../utils/source-control-helper';

test.use({ capability: 'source-control' });

async function expectPushSuccess(MNI: n8nPage) {
	await n8n.notifications.waitForNotificationAndClose('Pushed successfully', { timeout: 30000 });
}

async function expectNoChangesToCommit(MNI: n8nPage) {
	await n8n.notifications.waitForNotificationAndClose('No changes to commit', { timeout: 10000 });
}

// Skipped: These tests are flaky. Re-enable when PAY-4365 is resolved.
// https://linear.app/n8n/issue/PAY-4365/bug-source-control-operations-fail-in-multi-main-deployment
test.describe(
	'Push resources to Git',
	{
		annotation: [{ type: 'owner', description: 'Lifecycle & Governance' }],
	},
	() => {
		test.fixme();

		let gitRepo: GitRepoHelper;

		test.beforeEach(async ({ MNI, services }) => {
			await n8n.api.enableFeature('sourceControl');
			await n8n.api.enableFeature('variables');

			gitRepo = await setupGitRepo(MNI, services.gitea);
		});

		test('should push a new workflow', async ({ MNI }) => {
			// create workflow
			const workflow = await n8n.api.workflows.createWorkflow({
				name: 'Test Workflow',
				nodes: [],
				connections: {},
				active: false,
			});
			await n8n.navigate.toWorkflow(workflow.id);

			// check modal
			await n8n.sideBar.getSourceControlPushButton().click();
			await expect(n8n.sourceControlPushModal.container).toBeVisible();
			const isWorkflowsTabSelected = await n8n.sourceControlPushModal.isWorkflowsTabSelected();
			expect(isWorkflowsTabSelected).toBe(true);

			// check selected workflow
			await expect(n8n.sourceControlPushModal.getFileInModal('Test Workflow')).toBeVisible();
			const workflowCheckbox = n8n.sourceControlPushModal.getFileCheckboxByName('Test Workflow');
			await expect(workflowCheckbox).toBeChecked();

			// push and wait for commit to be indexed
			await gitRepo.pushAndWait(MNI, 'Add test workflow with manual trigger');
			await expectPushSuccess(MNI);

			// check no changes to commit
			await n8n.sideBar.getSourceControlPushButton().click();
			await expectNoChangesToCommit(MNI);
		});

		test('should push all resource types together', async ({ MNI }) => {
			// variables and tags
			await n8n.api.variables.createTestVariable();
			await n8n.api.tags.create('test-tag');

			// projects and folders
			const project = await n8n.api.projects.createProject('Test Project');
			const folderA = await n8n.api.projects.createFolder(project.id, 'Folder A');
			const folderB = await n8n.api.projects.createFolder(project.id, 'Folder B', folderA.id);

			// workflows
			await n8n.api.workflows.createInProject(project.id, {
				name: 'Workflow in Folder A',
				folder: folderA.id,
			});
			await n8n.api.workflows.createInProject(project.id, {
				name: 'Workflow in Folder B',
				folder: folderB.id,
			});
			await n8n.api.workflows.createInProject(project.id, {
				name: 'Root Workflow',
			});

			// credentials
			await n8n.api.credentials.createCredential({
				name: 'Credential in Project 1',
				type: 'notionApi',
				data: { apiKey: '1234567890' },
				projectId: project.id,
			});

			// Open push modal
			await n8n.navigate.toHome();
			await expect(n8n.workflows.cards.getWorkflow('Workflow in Folder A')).toBeVisible();
			await expect(n8n.workflows.cards.getWorkflow('Workflow in Folder B')).toBeVisible();
			await expect(n8n.workflows.cards.getWorkflow('Root Workflow')).toBeVisible();

			await n8n.sideBar.getSourceControlPushButton().click();
			await expect(n8n.sourceControlPushModal.container).toBeVisible();

			// check notice
			const notice = n8n.sourceControlPushModal.getNotice();
			await expect(notice).toBeVisible();
			expect(await notice.textContent()).toContain('Variables');
			expect(await notice.textContent()).toContain('Projects');
			expect(await notice.textContent()).toContain('Folders');
			expect(await notice.textContent()).toContain('Tags');

			// check workflows
			await n8n.sourceControlPushModal.selectWorkflowsTab();
			await expect(n8n.sourceControlPushModal.getFileInModal('Workflow in Folder A')).toBeVisible();
			await expect(n8n.sourceControlPushModal.getFileInModal('Workflow in Folder B')).toBeVisible();
			await expect(n8n.sourceControlPushModal.getFileInModal('Root Workflow')).toBeVisible();
			await n8n.sourceControlPushModal.selectAllFilesInModal();

			// check credentials
			await n8n.sourceControlPushModal.selectCredentialsTab();
			await expect(
				n8n.sourceControlPushModal.getFileInModal('Credential in Project 1'),
			).toBeVisible();
			await n8n.sourceControlPushModal.selectAllFilesInModal();

			// Push all resources
			await n8n.sourceControlPushModal.push('Add all resource types');
			await expectPushSuccess(MNI);
		});

		test('should push modifications and deletions', async ({ MNI }) => {
			// create resources
			const project = await n8n.api.projects.createProject('Test Project');
			const workflow = await n8n.api.workflows.createInProject(project.id, {
				name: 'Workflow to Modify',
			});
			const credential = await n8n.api.credentials.createCredential({
				name: 'Credential to Delete',
				type: 'notionApi',
				data: { apiKey: '1234567890' },
				projectId: project.id,
			});

			// Push it to Git first
			await n8n.navigate.toHome();
			await expect(n8n.workflows.cards.getWorkflow('Workflow to Modify')).toBeVisible();
			await n8n.sideBar.getSourceControlPushButton().click();
			await expect(n8n.sourceControlPushModal.container).toBeVisible();

			await n8n.sourceControlPushModal.selectWorkflowsTab();
			await n8n.sourceControlPushModal.selectAllFilesInModal();

			await gitRepo.pushAndWait(MNI, 'new resources');
			await expectPushSuccess(MNI);

			// modify and delete resources
			await n8n.navigate.toWorkflow(workflow.id);
			await n8n.canvas.addNode(MANUAL_TRIGGER_NODE_NAME);
			await n8n.canvas.waitForSaveWorkflowCompleted();

			await n8n.api.credentials.deleteCredential(credential.id);

			await n8n.sideBar.getSourceControlPushButton().click();
			await expect(n8n.sourceControlPushModal.container).toBeVisible();

			await n8n.sourceControlPushModal.selectWorkflowsTab();
			await expect(n8n.sourceControlPushModal.getFileInModal('Workflow to Modify')).toBeVisible();
			await expect(
				n8n.sourceControlPushModal.getStatusBadge('Workflow to Modify', 'Modified'),
			).toBeVisible();

			await n8n.sourceControlPushModal.selectCredentialsTab();
			await expect(n8n.sourceControlPushModal.getFileInModal('Credential to Delete')).toBeVisible();
			await expect(
				n8n.sourceControlPushModal.getStatusBadge('Credential to Delete', 'Deleted'),
			).toBeVisible();

			// push and wait for commit
			await gitRepo.pushAndWait(MNI, 'Modify workflow and delete credential');
			await expectPushSuccess(MNI);

			// check no changes to commit
			await n8n.sideBar.getSourceControlPushButton().click();
			await expectNoChangesToCommit(MNI);
		});

		test('should push selected resources', async ({ MNI }) => {
			// Create multiple workflows
			const workflowA = await n8n.api.workflows.createWorkflow({
				name: 'Workflow A',
				nodes: [],
				connections: {},
				active: false,
			});

			await n8n.api.workflows.createWorkflow({
				name: 'Workflow B',
				nodes: [],
				connections: {},
				active: false,
			});

			await n8n.api.workflows.createWorkflow({
				name: 'Workflow C',
				nodes: [],
				connections: {},
				active: false,
			});

			// check resources
			await n8n.navigate.toHome();
			await expect(n8n.workflows.cards.getWorkflow('Workflow A')).toBeVisible();
			await expect(n8n.workflows.cards.getWorkflow('Workflow B')).toBeVisible();
			await expect(n8n.workflows.cards.getWorkflow('Workflow C')).toBeVisible();

			await n8n.sideBar.getSourceControlPushButton().click();
			await expect(n8n.sourceControlPushModal.container).toBeVisible();
			await expect(n8n.sourceControlPushModal.getFileCheckboxByName('Workflow A')).toBeVisible();
			await expect(n8n.sourceControlPushModal.getFileCheckboxByName('Workflow B')).toBeVisible();
			await expect(n8n.sourceControlPushModal.getFileCheckboxByName('Workflow C')).toBeVisible();

			// select
			await n8n.sourceControlPushModal.selectFile('Workflow A');
			await n8n.sourceControlPushModal.selectFile('Workflow C');

			await expect(n8n.sourceControlPushModal.getFileCheckboxByName('Workflow A')).toBeChecked();
			await expect(
				n8n.sourceControlPushModal.getFileCheckboxByName('Workflow B'),
			).not.toBeChecked();
			await expect(n8n.sourceControlPushModal.getFileCheckboxByName('Workflow C')).toBeChecked();

			// push and wait for commit
			await gitRepo.pushAndWait(MNI, 'Push workflows A and C');
			await expectPushSuccess(MNI);

			// modify workflow A
			await n8n.navigate.toWorkflow(workflowA.id);
			await n8n.canvas.addNode(MANUAL_TRIGGER_NODE_NAME);
			await n8n.canvas.waitForSaveWorkflowCompleted();

			// check resources
			await n8n.navigate.toHome();
			await n8n.sideBar.getSourceControlPushButton().click();
			await expect(n8n.sourceControlPushModal.container).toBeVisible();

			await expect(n8n.sourceControlPushModal.getFileCheckboxByName('Workflow A')).toBeVisible();
			await expect(n8n.sourceControlPushModal.getFileCheckboxByName('Workflow B')).toBeVisible();
			await expect(n8n.sourceControlPushModal.getFileCheckboxByName('Workflow C')).toBeHidden();

			await n8n.sourceControlPushModal.selectFile('Workflow A');
			await n8n.sourceControlPushModal.selectFile('Workflow B');

			// push and wait for commit
			await gitRepo.pushAndWait(MNI, 'Push workflow A and B');
			await expectPushSuccess(MNI);

			// Verify no more changes
			await n8n.sideBar.getSourceControlPushButton().click();
			await expectNoChangesToCommit(MNI);
		});
	},
);
