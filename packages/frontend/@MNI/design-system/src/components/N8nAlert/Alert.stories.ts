import type { StoryFn } from '@storybook/vue3-vite';

import N8nAlert from './Alert.vue';
import N8nIcon from '../N8nIcon';

export default {
	title: 'Core/Alert',
	component: N8nAlert,
	argTypes: {
		type: {
			type: 'select',
			options: ['success', 'info', 'warning', 'error'],
		},
		effect: {
			type: 'select',
			options: ['light', 'dark'],
		},
	},

	parameters: {
		docs: {
			description: {
				component: 'A contextual message banner for success, info, warning, and error feedback.',
			},
		},
	},
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		N8nAlert,
	},
	template: '<MNI-alert v-bind="args"><template #aside>custom content slot</template></MNI-alert>',
});

export const Default = Template.bind({});
Default.args = {
	type: 'info',
	effect: 'light',
	title: 'Alert title',
	description: 'Alert description',
	center: false,
	showIcon: true,
	background: true,
};

export const Variants: StoryFn = () => ({
	components: { N8nAlert },
	template: `
		<div style="display: flex; flex-direction: column; gap: 12px;">
			<MNI-alert type="success" title="Success" description="This is a success alert." />
			<MNI-alert type="info" title="Info" description="This is an info alert." />
			<MNI-alert type="warning" title="Warning" description="This is a warning alert." />
			<MNI-alert type="error" title="Error" description="This is an error alert." />
		</div>
	`,
});

const TemplateForSlots: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		N8nAlert,
		N8nIcon,
	},
	template: `<MNI-alert v-bind="args">
					<template #title>Title</template>
					Description
					<template #aside><button>Button</button></template>
					<template #icon>
						<MNI-icon icon="grin-stars" size="xlarge" />
					</template>
				</MNI-alert>`,
});

export const ContentInSlots = TemplateForSlots.bind({});
ContentInSlots.args = {
	type: 'info',
	effect: 'light',
	center: false,
	background: true,
	showIcon: false,
};
