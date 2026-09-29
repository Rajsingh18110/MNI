import { getAndParseConfigFromMetaTag } from '@n8n/stores/metaTagConfig';

const endpoints = getAndParseConfigFromMetaTag<Record<string, string>>('endpoints') || {};

const documentationUrl = endpoints.documentationUrl || 'https://docs.n8n.io';
const communityUrl = endpoints.communityUrl || 'https://community.n8n.io';
const supportUrl = endpoints.supportUrl || 'https://support.n8n.io';

export const EXTERNAL_LINKS = {
	QUICKSTART_VIDEO: 'https://www.youtube.com/watch?v=4cQWJViybAQ',
	DOCUMENTATION: `${documentationUrl}?utm_source=n8n_app&utm_medium=app_sidebar`,
	FORUM: `${communityUrl}?utm_source=n8n_app&utm_medium=app_sidebar`,
	COURSES: `${documentationUrl}/courses/`,
	SUPPORT: supportUrl,
} as const;
