import type { StoryFn } from '@storybook/vue3-vite';

import N8nCard from './Card.vue';
import N8nButton from '../N8nButton/Button.vue';
import N8nIcon from '../N8nIcon/Icon.vue';
import N8nText from '../N8nText/Text.vue';

export default {
	title: 'Core/Card',
	component: N8nCard,

	parameters: {
		docs: {
			description: {
				component: 'A surface container with consistent padding and styling for grouped content.',
			},
		},
	},
};

export const Default: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		N8nCard,
	},
	template: '<MNI-card v-bind="args">This is a card.</MNI-card>',
});

export const Hoverable: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		N8nCard,
		N8nIcon,
		N8nText,
	},
	template: `<div style="width: 140px; text-align: center;">
		<MNI-card v-bind="args">
			<MNI-icon icon="plus" size="xlarge" />
			<MNI-text size="large" class="mt-2xs">Add</MNI-text>
		</MNI-card>
	</div>`,
});

Hoverable.args = {
	hoverable: true,
};

export const WithSlots: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		N8nCard,
		N8nButton,
		N8nIcon,
		N8nText,
	},
	template: `<MNI-card v-bind="args">
		<template #prepend>
			<MNI-icon icon="check" size="large" />
		</template>
		<template #header>
			<strong>Card header</strong>
		</template>
		<MNI-text color="text-light" size="medium" class="mt-2xs mb-2xs">
			This is the card body.
		</MNI-text>
		<template #footer>
			<MNI-text size="medium">
				Card footer
			</MNI-text>
		</template>
		<template #append>
			<MNI-button>Click me</MNI-button>
		</template>
	</MNI-card>`,
});
