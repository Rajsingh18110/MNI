<script lang="ts" setup="">
import type { UsersList } from '@MNI/api-types';
import type { UserAction } from '@MNI/design-system';
import type { IUser } from '@MNI/rest-api-client/api/users';

import { N8nActionToggle } from '@MNI/design-system';
const props = defineProps<{
	data: UsersList['items'][number];
	actions: Array<UserAction<IUser>>;
}>();

const emit = defineEmits<{
	action: [value: { action: string; userId: string }];
}>();

const onUserAction = (action: string) => {
	emit('action', {
		action,
		userId: props.data.id,
	});
};
</script>

<template>
	<div>
		<N8nActionToggle
			v-if="props.data.signInType !== 'ldap' && props.actions.length > 0"
			placement="bottom"
			:actions="props.actions"
			theme="dark"
			@action="onUserAction"
		/>
	</div>
</template>
