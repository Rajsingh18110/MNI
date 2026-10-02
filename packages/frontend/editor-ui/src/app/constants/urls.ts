import { getAndParseConfigFromMetaTag } from '@MNI/stores/metaTagConfig';

// Fetch the endpoints configuration injected by the backend during startup
const endpoints = getAndParseConfigFromMetaTag<Record<string, string>>('endpoints') || {};

export const DOCS_DOMAIN = '';
export const BUILTIN_NODES_DOCS_URL = '';
export const BUILTIN_CREDENTIALS_DOCS_URL = '';
export const DATA_PINNING_DOCS_URL = '';
export const DATA_EDITING_DOCS_URL = '';
export const SCHEMA_PREVIEW_DOCS_URL = '';
export const MFA_DOCS_URL = '';
export const NPM_PACKAGE_DOCS_BASE_URL = 'https://www.npmjs.com/package/';
export const MNI_QUEUE_MODE_DOCS_URL = '';
export const CUSTOM_NODES_DOCS_URL = '';
export const CUSTOM_ROLES_DOCS_URL = '';
export const END_USER_CREDENTIALS_DOCS_URL = '';
export const EXPRESSIONS_DOCS_URL = '';
export const EVALUATIONS_DOCS_URL = '';
export const ERROR_WORKFLOW_DOCS_URL = '';
export const EXECUTION_DATA_REDACTION_DOCS_URL = '';
export const EXECUTION_DATA_REDACTION_ENFORCEMENT_DOCS_URL = '';
export const SECURITY_POLICIES_DOCS_URL = '';
export const TIME_SAVED_DOCS_URL = '';
export const BASE_NODE_SURVEY_URL = '';
export const RELEASE_NOTES_URL = '';
export const CHANGELOG_URL = '';
export const CREATOR_HUB_URL = '';

export const CLOUD_CHANGE_PLAN_PAGE = '';

export const CLOUD_MNI_CONNECT_TOP_UP_PATH = '/manage/gateway';

/**
 * Urls used to route users to the right template repository
 */
export const TEMPLATES_URLS = {
	DEFAULT_API_HOST: 'https://api.n8n.io/api/',
	BASE_WEBSITE_URL: 'https://n8n.io/workflows/',
	UTM_QUERY: {
		utm_source: 'MNI_app',
		utm_medium: 'template_library',
	},
};
