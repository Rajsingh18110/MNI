import type { StoryFn } from '@storybook/vue3-vite';

import N8nInfoTip from './InfoTip.vue';

export default {
	title: 'Core/InfoTip',
	component: N8nInfoTip,

	parameters: {
		docs: {
			description: { component: 'An inline helper text element for short contextual guidance.' },
		},
	},
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		N8nInfoTip,
	},
	template:
		'<MNI-info-tip v-bind="args">Need help doing something? <a href="/docs" target="_blank">Open docs</a></MNI-info-tip>',
});

export const Default = Template.bind({});

export const Variants: StoryFn = () => ({
	components: { N8nInfoTip },
	template: `
		<div style="display: flex; flex-direction: column; gap: 12px;">
			<MNI-info-tip theme="info">Info tip</MNI-info-tip>
			<MNI-info-tip theme="info-light">Info light tip</MNI-info-tip>
			<MNI-info-tip theme="warning">Warning tip</MNI-info-tip>
			<MNI-info-tip theme="warning-light">Warning light tip</MNI-info-tip>
			<MNI-info-tip theme="danger">Danger tip</MNI-info-tip>
			<MNI-info-tip theme="success">Success tip</MNI-info-tip>
			<MNI-info-tip type="tooltip" tooltip-placement="right">Tooltip tip</MNI-info-tip>
		</div>
	`,
});

export const Sizes: StoryFn = () => ({
	components: { N8nInfoTip },
	template: `
		<div style="display: flex; flex-direction: column; gap: 12px;">
			<MNI-info-tip size="xsmall">XSmall</MNI-info-tip>
			<MNI-info-tip size="small">Small</MNI-info-tip>
			<MNI-info-tip size="medium">Medium</MNI-info-tip>
			<MNI-info-tip size="large">Large</MNI-info-tip>
			<MNI-info-tip size="xlarge">XLarge</MNI-info-tip>
		</div>
	`,
});

export const Tooltip = Template.bind({});
Tooltip.args = {
	type: 'tooltip',
	tooltipPlacement: 'right',
};
