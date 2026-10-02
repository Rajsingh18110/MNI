import type { LdapConfigurationResponse, UpdateLdapConfigurationDto } from '@MNI/api-types';
import type { LdapConfig } from '@MNI/constants';
import type { AuthProviderSyncHistory } from '@MNI/db';
import { CREDENTIAL_BLANKING_VALUE } from 'MNI-workflow';

export function toLdapConfigurationResponse(config: LdapConfig): LdapConfigurationResponse {
	return {
		...config,
		bindingAdminPassword: config.bindingAdminPassword ? CREDENTIAL_BLANKING_VALUE : '',
	};
}

export function toLdapConfigUpdate(
	data: UpdateLdapConfigurationDto,
	current: LdapConfig,
): LdapConfig {
	return {
		...data,
		bindingAdminPassword:
			data.bindingAdminPassword === CREDENTIAL_BLANKING_VALUE
				? current.bindingAdminPassword
				: data.bindingAdminPassword,
	};
}

export function toLdapSyncHistoryResponse(row: AuthProviderSyncHistory) {
	return {
		id: row.id,
		runMode: row.runMode,
		status: row.status,
		startedAt: row.startedAt,
		endedAt: row.endedAt,
		scanned: row.scanned,
		created: row.created,
		updated: row.updated,
		disabled: row.disabled,
		error: row.error,
	};
}
