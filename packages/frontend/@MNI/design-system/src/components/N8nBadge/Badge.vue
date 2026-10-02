<script lang="ts" setup>
import { Primitive } from 'reka-ui';
import { computed } from 'vue';

import type { IconSize } from '../../types';
import N8nIcon from '../N8nIcon';
import N8nText from '../N8nText';
import type { BadgeProps } from './Badge.type';

defineOptions({ name: 'N8nBadge' });

const props = withDefaults(defineProps<BadgeProps>(), {
	variant: 'outline',
	size: 'xsmall',
	clickable: false,
});

const effectiveIconSize = computed(function getEffectiveIconSize(): IconSize {
	switch (props.size) {
		case 'large':
		case 'xlarge':
			return 'xlarge';
		default:
			return 'medium';
	}
});
const effectiveTextSize = computed(function getEffectiveTextSize() {
	switch (props.size) {
		case 'large':
		case 'xlarge':
			return 'sm';
		case 'xsmall':
		case 'xxsmall':
			return '2xs';
		default:
			return 'xs';
	}
});
</script>

<template>
	<Primitive
		:as="props.clickable ? 'button' : 'span'"
		:type="props.clickable ? 'button' : undefined"
		:disabled="props.clickable ? props.disabled : undefined"
		:class="[
			'MNI-badge',
			$style.badge,
			$style[variant],
			$style[size],
			{ [$style.clickable]: props.clickable },
		]"
	>
		<N8nIcon
			v-if="props.leadingIcon"
			:class="$style.leadingIcon"
			:icon="props.leadingIcon"
			:size="effectiveIconSize"
		/>
		<slot name="leading" />
		<N8nText :class="$style.label" :step="effectiveTextSize" bold>
			<slot></slot>
		</N8nText>
		<slot name="trailing" />
		<N8nIcon
			v-if="props.trailingIcon"
			:class="$style.trailingIcon"
			:icon="props.trailingIcon"
			:size="effectiveIconSize"
		/>
	</Primitive>
</template>

<style lang="scss" module>
@use '../../css/mixins/focus';
@use '../../css/mixins/utils';

.badge {
	display: inline-flex;
	align-items: center;
	white-space: nowrap;
	border-radius: var(--radius--full);
	user-select: none;
	appearance: none;
	width: fit-content;

	--MNI-badge--background: light-dark(var(--color--neutral-200), var(--color--neutral-700));
	--MNI-badge--border-color: var(--MNI-badge--background);
	--MNI-badge--text-color: var(--text-color--subtle);
	--MNI-badge--height: var(--height--sm);
	--MNI-badge--padding-inline-start: var(--spacing--2xs);
	--MNI-badge--padding-inline-end: var(--spacing--2xs);
	--MNI-badge--gap: var(--spacing--4xs);

	gap: var(--MNI-badge--gap);
	background-color: var(--MNI-badge--background);
	border: 1px solid var(--MNI-badge--border-color);
	height: var(--MNI-badge--height);
	padding-inline: var(--MNI-badge--padding-inline-start) var(--MNI-badge--padding-inline-end);
	color: var(--MNI-badge--text-color);
}

.label {
	@include utils.utils-ellipsis;
}

.clickable {
	outline: none;
	cursor: pointer;

	&:not(:disabled):hover {
		background-color: color-mix(in srgb, var(--MNI-badge--background), black 5%);
	}

	&:not(:disabled):active {
		background-color: color-mix(in srgb, var(--MNI-badge--background), black 10%);
	}

	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	&:focus-visible {
		@include focus.focus-ring-with-border;
	}
}

.xxsmall {
	--MNI-badge--height: var(--height--2xs);
	--MNI-badge--padding-inline-start: var(--spacing--2xs);
	--MNI-badge--padding-inline-end: var(--spacing--2xs);
}

.xsmall {
	--MNI-badge--height: var(--height--xs);
	--MNI-badge--padding-inline-start: var(--spacing--2xs);
	--MNI-badge--padding-inline-end: var(--spacing--2xs);
}

.small {
	--MNI-badge--height: var(--height--sm);
	--MNI-badge--padding-inline-start: var(--spacing--2xs);
	--MNI-badge--padding-inline-end: var(--spacing--2xs);
}

.medium {
	--MNI-badge--height: var(--height--md);
	--MNI-badge--padding-inline-start: var(--spacing--xs);
	--MNI-badge--padding-inline-end: var(--spacing--xs);
}

.large {
	--MNI-badge--height: var(--height--lg);
	--MNI-badge--padding-inline-start: var(--spacing--sm);
	--MNI-badge--padding-inline-end: var(--spacing--sm);
}

.xlarge {
	--MNI-badge--height: var(--height--xl);
	--MNI-badge--padding-inline-start: var(--spacing--sm);
	--MNI-badge--padding-inline-end: var(--spacing--sm);
}

.filled {
	--MNI-badge--background: light-dark(var(--color--neutral-200), var(--color--neutral-700));
	--MNI-badge--border-color: var(--MNI-badge--background);
	--MNI-badge--text-color: var(--text-color--subtle);
}

.primary {
	--MNI-badge--background: var(--background--brand);
	--MNI-badge--text-color: var(--color--neutral-white);
}

.secondary {
	--MNI-badge--background: var(--color--purple-200);
	--MNI-badge--text-color: var(--color--purple-900);
}

.subtle {
	--MNI-badge--background: var(--background--surface);
	--MNI-badge--border-color: var(--border-color);
	--MNI-badge--text-color: var(--text-color--subtle);
	box-shadow: var(--shadow--xs);
}

.outline {
	--MNI-badge--background: transparent;
	--MNI-badge--border-color: var(--border-color);
	--MNI-badge--text-color: var(--text-color);
}

.ghost {
	--MNI-badge--background: transparent;
	--MNI-badge--border-color: transparent;
	--MNI-badge--text-color: var(--text-color);
}

.warning {
	--MNI-badge--background: var(--color--yellow-200);
	--MNI-badge--text-color: var(--color--yellow-900);
}

.danger {
	--MNI-badge--background: var(--color--red-200);
	--MNI-badge--text-color: var(--color--red-900);
}

.success {
	--MNI-badge--background: var(--color--green-200);
	--MNI-badge--text-color: var(--color--green-900);
}

.info {
	--MNI-badge--background: var(--color--blue-200);
	--MNI-badge--text-color: var(--color--blue-900);
}

.leadingIcon,
.trailingIcon {
	flex-shrink: 0;
	opacity: 0.9;
}
.leadingIcon + .label {
	margin-inline-end: calc(var(--MNI-badge--padding-inline-end) * 0.2);
}

.label + .trailingIcon {
	margin-inline-start: calc(var(--MNI-badge--padding-inline-start) * 0.2);
}
</style>
