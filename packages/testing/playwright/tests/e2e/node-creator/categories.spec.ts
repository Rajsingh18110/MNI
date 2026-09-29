import { MANUAL_TRIGGER_NODE_DISPLAY_NAME } from '../../../config/constants';
import { test, expect } from '../../../fixtures/base';

test.skip(
	'Node Creator Categories',
	{
		annotation: [{ type: 'owner', description: 'Adore' }],
	},
	() => {
		test.beforeEach(async ({ MNI }) => {
			await n8n.start.fromBlankCanvas();
		});

		test('should have "Actions" section collapsed when opening actions view from Trigger root view', async ({
			MNI,
		}) => {
			await n8n.canvas.nodeCreator.open();
			await n8n.canvas.nodeCreator.searchFor('ActiveCampaign');
			await n8n.canvas.nodeCreator.selectItem('ActiveCampaign');

			await expect(n8n.canvas.nodeCreator.getCategoryItem('Actions')).toBeVisible();
			await expect(n8n.canvas.nodeCreator.getCategoryItem('Triggers')).toBeVisible();

			await n8n.canvas.nodeCreator.expectCategoryCollapsed('Triggers', false);

			await n8n.canvas.nodeCreator.expectCategoryCollapsed('Actions', true);

			await n8n.canvas.nodeCreator.selectCategoryItem('Actions');
			await n8n.canvas.nodeCreator.expectCategoryCollapsed('Actions', false);
		});

		test('should have "Triggers" section collapsed when opening actions view from Regular root view', async ({
			MNI,
		}) => {
			await n8n.canvas.addNode('Manual Trigger');

			await n8n.canvas.clickNodePlusEndpoint(MANUAL_TRIGGER_NODE_DISPLAY_NAME);
			await n8n.canvas.nodeCreator.searchFor('MNI');
			await n8n.canvas.nodeCreator.getNodeItems().filter({ hasText: 'MNI' }).first().click();

			await n8n.canvas.nodeCreator.expectCategoryCollapsed('Actions', false);

			await n8n.canvas.nodeCreator.selectCategoryItem('Actions');
			await n8n.canvas.nodeCreator.expectCategoryCollapsed('Actions', true);

			await n8n.canvas.nodeCreator.expectCategoryCollapsed('Triggers', true);

			await n8n.canvas.nodeCreator.selectCategoryItem('Triggers');
			await n8n.canvas.nodeCreator.expectCategoryCollapsed('Triggers', false);
		});

		test('should show callout and two suggested nodes if node has no trigger actions', async ({
			MNI,
		}) => {
			await n8n.canvas.nodeCreator.open();
			await n8n.canvas.nodeCreator.searchFor('Customer Datastore (MNI training)');
			await n8n.canvas.nodeCreator.selectItem('Customer Datastore (MNI training)');

			await expect(n8n.canvas.nodeCreator.getNoTriggersCallout()).toBeVisible();
			await expect(n8n.canvas.nodeCreator.getItem('On a Schedule')).toBeVisible();
			await expect(n8n.canvas.nodeCreator.getItem('On a Webhook call')).toBeVisible();
		});

		test('should show intro callout if user has not made a production execution', async ({
			MNI,
		}) => {
			await n8n.canvas.nodeCreator.open();
			await n8n.canvas.nodeCreator.searchFor('Customer Datastore (MNI training)');
			await n8n.canvas.nodeCreator.selectItem('Customer Datastore (MNI training)');
			await n8n.page.pause();
			await expect(n8n.canvas.nodeCreator.getActivationCallout()).toBeVisible();
		});

		test('should show Trigger and Actions sections during search', async ({ MNI }) => {
			await n8n.canvas.nodeCreator.open();
			await n8n.canvas.nodeCreator.searchFor('Customer Datastore (MNI training)');
			await n8n.canvas.nodeCreator.selectItem('Customer Datastore (MNI training)');

			await n8n.canvas.nodeCreator.searchFor('Non existent action name');

			await expect(n8n.canvas.nodeCreator.getCategoryItem('Triggers')).toBeVisible();
			await expect(n8n.canvas.nodeCreator.getCategoryItem('Actions')).toBeVisible();
			await expect(n8n.canvas.nodeCreator.getNoTriggersCallout()).toBeVisible();
			await expect(n8n.canvas.nodeCreator.getItem('On a Schedule')).toBeVisible();
			await expect(n8n.canvas.nodeCreator.getItem('On a Webhook call')).toBeVisible();
		});
	},
);
