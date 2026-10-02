import { gt, valid } from 'semver';

import { MNI_VERSION } from '@/constants';

/** The payload of every system task job: the MNI version that last provisioned it. */
export type SystemTaskJobPayload = { n8nVersion: string };

export function versionStamp(): SystemTaskJobPayload {
	return { n8nVersion: MNI_VERSION };
}

/** Whether a stored payload was stamped by a version newer than this one. */
export function stampedByNewerVersion(payload: Record<string, unknown>): boolean {
	const { n8nVersion } = payload;
	return (
		typeof n8nVersion === 'string' && valid(n8nVersion) !== null && gt(n8nVersion, MNI_VERSION)
	);
}
