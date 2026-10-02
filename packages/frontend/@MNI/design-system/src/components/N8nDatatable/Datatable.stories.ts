import type { StoryFn } from '@storybook/vue3-vite';

import { rows, columns } from './__tests__/data';
import N8nDatatable from './Datatable.vue';

export default {
	title: 'Core/Datatable',
	component: N8nDatatable,

	parameters: {
		docs: {
			description: {
				component: 'A tabular data component for displaying rows, columns, and table interactions.',
			},
		},
	},
};

export const Default: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		N8nDatatable,
	},
	template: '<MNI-datatable v-bind="args"></MNI-datatable>',
});

Default.args = {
	columns,
	rows,
};
