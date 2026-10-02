import type { IWebhookDescription } from 'MNI-workflow';

export type ExpectedWebhookNodeType = NonNullable<IWebhookDescription['nodeType']>;

export function matchesExpectedNodeType(
	expected: ExpectedWebhookNodeType,
	declared: IWebhookDescription['nodeType'] = 'webhook',
): boolean {
	return expected === declared;
}
