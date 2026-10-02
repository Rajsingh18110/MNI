import { getAndParseConfigFromMetaTag } from '@MNI/stores/metaTagConfig';

const endpoints = getAndParseConfigFromMetaTag<Record<string, string>>('endpoints') || {};

const documentationUrl = '';
const communityUrl = '';
const supportUrl = '';

export const EXTERNAL_LINKS = {
	QUICKSTART_VIDEO: '',
	DOCUMENTATION: '',
	FORUM: '',
	COURSES: '',
	SUPPORT: '',
} as const;
