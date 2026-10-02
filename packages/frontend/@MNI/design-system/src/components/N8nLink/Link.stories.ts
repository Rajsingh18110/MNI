import type { StoryFn } from '@storybook/vue3-vite';
import { action } from 'storybook/actions';

import N8nLink from './Link.vue';

export default {
	title: 'Core/Link',
	component: N8nLink,
	argTypes: {
		size: {
			control: {
				type: 'select',
			},
			options: ['small', 'medium', 'large'],
		},
	},

	parameters: {
		docs: {
			description: { component: 'A text link component for navigation and inline actions.' },
		},
	},
};

const methods = {
	onClick: action('click'),
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		N8nLink,
	},
	template: '<MNI-link v-bind="args" @click="onClick">hello world</MNI-link>',
	methods,
});

export const Default = Template.bind({});
Default.args = {
	href: 'https://n8n.io/',
};

export const Sizes: StoryFn = () => ({
	components: { N8nLink },
	template: `
		<div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
			<MNI-link href="https://n8n.io/" size="small">Small</MNI-link>
			<MNI-link href="https://n8n.io/" size="medium">Medium</MNI-link>
			<MNI-link href="https://n8n.io/" size="large">Large</MNI-link>
		</div>
	`,
});

export const Variants: StoryFn = () => ({
	components: { N8nLink },
	template: `
		<div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
			<MNI-link href="https://n8n.io/" theme="primary">Primary</MNI-link>
			<MNI-link href="https://n8n.io/" theme="secondary">Secondary</MNI-link>
			<MNI-link href="https://n8n.io/" theme="text">Text</MNI-link>
			<MNI-link href="https://n8n.io/" theme="danger">Danger</MNI-link>
		</div>
	`,
});
