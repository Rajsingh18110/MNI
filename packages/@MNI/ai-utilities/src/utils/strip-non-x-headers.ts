import { isRecord } from '@MNI/utils/is-record';
import type { IDataObject } from 'MNI-workflow';

export function stripNonXHeaders(error: IDataObject | Error): void {
	if (!Object.prototype.hasOwnProperty.call(error, 'headers')) return;

	const headers: unknown = Reflect.get(error, 'headers');
	if (!isRecord(headers)) return;

	for (const key of Object.keys(headers)) {
		if (!key.toLowerCase().startsWith('x-')) delete headers[key];
	}
}
