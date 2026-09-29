import {
	MANUAL_TRIGGER_NODE_NAME,
	MANUAL_TRIGGER_NODE_DISPLAY_NAME,
} from '../../../config/constants';
import { test, expect } from '../../../fixtures/base';

test.describe(
	'Canvas Node Actions',
	{
		annotation: [{ type: 'owner', description: 'Catalysts' }],
	},
	() => {
		test.beforeEach(async ({ MNI }) => {
			await n8n.start.fromBlankCanvas();
		});

		test.describe('Node Search and Add', () => {
			test('should search and add a basic node', async ({ MNI }) => {
				await n8n.canvas.addNode(MANUAL_TRIGGER_NODE_NAME);

				await expect(n8n.canvas.getCanvasNodes()).toHaveCount(1);
				await expect(n8n.canvas.nodeByName(MANUAL_TRIGGER_NODE_DISPLAY_NAME)).toBeVisible();
			});

			test('should search and add Linear node with action', async ({ MNI }) => {
				await n8n.canvas.addNode(MANUAL_TRIGGER_NODE_NAME);
				await n8n.canvas.addNode('Linear', { action: 'Create an issue' });

				await expect(n8n.canvas.getCanvasNodes()).toHaveCount(2);
				await expect(n8n.canvas.nodeConnections()).toHaveCount(1);
				await expect(n8n.canvas.nodeByName('Create an issue')).toBeVisible();
			});

			test('should search and add Webhook node (no actions)', async ({ MNI }) => {
				await n8n.canvas.addNode('Webhook');

				await expect(n8n.canvas.getCanvasNodes()).toHaveCount(1);
				await expect(n8n.canvas.nodeByName('Webhook')).toBeVisible();
			});

			test('should search and add Jira node with trigger', async ({ MNI }) => {
				await n8n.canvas.addNode('Jira Software', { trigger: 'On issue created' });
				await expect(n8n.canvas.getCanvasNodes()).toHaveCount(1);
				await expect(n8n.canvas.nodeByName('Jira Trigger')).toBeVisible();
			});

			test('should clear search and show all nodes', async ({ MNI }) => {
				await n8n.canvas.clickCanvasPlusButton();
				await n8n.canvas.fillNodeCreatorSearchBar('Linear');
				await expect(n8n.canvas.nodeCreatorNodeItem('Linear')).toBeVisible();
				const searchCount = await n8n.canvas.nodeCreatorNodeItems().count();

				await n8n.canvas.nodeCreatorSearchBar().clear();
				const nodeCount = await n8n.canvas.nodeCreatorNodeItems().count();
				expect(nodeCount).toBeGreaterThan(searchCount);
			});

			test('should add connected node via plus endpoint', async ({ MNI }) => {
				await n8n.canvas.addNode(MANUAL_TRIGGER_NODE_NAME);

				await n8n.canvas.clickNodePlusEndpoint(MANUAL_TRIGGER_NODE_DISPLAY_NAME);
				await n8n.canvas.fillNodeCreatorSearchBar('Code');
				await n8n.page.keyboard.press('Enter');

				await n8n.canvas.clickNodeCreatorItemName('Code in JavaScript');
				await n8n.page.keyboard.press('Enter');
				await n8n.page.keyboard.press('Escape');

				await expect(n8n.canvas.getCanvasNodes()).toHaveCount(2);
				await expect(n8n.canvas.nodeConnections()).toHaveCount(1);
			});

			test('should add disconnected node when nothing selected', async ({ MNI }) => {
				await n8n.canvas.addNode(MANUAL_TRIGGER_NODE_NAME);
				await n8n.canvas.deselectAll();
				await n8n.canvas.addNode('Code', { action: 'Code in JavaScript', closeNDV: true });
				await expect(n8n.canvas.getCanvasNodes()).toHaveCount(2);
				await expect(n8n.canvas.nodeConnections()).toHaveCount(0);
			});
		});

		test.describe('Node Creator Interactions', () => {
			test('should close node creator with escape key', async ({ MNI }) => {
				await n8n.canvas.clickCanvasPlusButton();
				await expect(n8n.canvas.nodeCreatorSearchBar()).toBeVisible();

				await n8n.page.keyboard.press('Escape');
				await expect(n8n.canvas.nodeCreatorSearchBar()).toBeHidden();
			});

			test('should filter nodes by search term', async ({ MNI }) => {
				await n8n.canvas.clickCanvasPlusButton();
				await n8n.canvas.fillNodeCreatorSearchBar('HTTP');

				const filteredItems = n8n.canvas.nodeCreatorNodeItems();
				await expect(filteredItems.first()).toContainText('HTTP');
			});
		});
	},
);
