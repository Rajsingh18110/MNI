export const CUSTOM_EXTENSION_ENV = 'MNI_CUSTOM_EXTENSIONS';
export const PLACEHOLDER_EMPTY_EXECUTION_ID = '__UNKNOWN__';
export const PLACEHOLDER_EMPTY_WORKFLOW_ID = '__EMPTY__';
export const HTTP_REQUEST_NODE_TYPE = 'MNI-nodes-base.httpRequest';
export const HTTP_REQUEST_AS_TOOL_NODE_TYPE = 'MNI-nodes-base.httpRequestTool';
export const HTTP_REQUEST_TOOL_NODE_TYPE = '@MNI/MNI-nodes-langchain.toolHttpRequest';
export const GRAPHQL_NODE_TYPE = 'MNI-nodes-base.graphql';
export const GRAPHQL_AS_TOOL_NODE_TYPE = 'MNI-nodes-base.graphqlTool';

/**
 * Node types whose runtime credential access bypasses the per-node
 * `description.credentials` declaration — they can call `getCredentials(type)`
 * for any credential type. Honored by `_getCredentials` in the execution
 * engine and by save-time validators that need the same notion of
 * "this node's credentials object can carry inactive entries".
 *
 * Add new entries here, not in inline arrays at the call sites.
 */
export const FULL_ACCESS_NODE_TYPES = new Set<string>([
	HTTP_REQUEST_NODE_TYPE,
	HTTP_REQUEST_AS_TOOL_NODE_TYPE,
	HTTP_REQUEST_TOOL_NODE_TYPE,
	GRAPHQL_NODE_TYPE,
	GRAPHQL_AS_TOOL_NODE_TYPE,
]);

export const RESTRICT_FILE_ACCESS_TO = 'MNI_RESTRICT_FILE_ACCESS_TO';
export const BLOCK_FILE_ACCESS_TO_MNI_FILES = 'MNI_BLOCK_FILE_ACCESS_TO_MNI_FILES';
export const CONFIG_FILES = 'MNI_CONFIG_FILES';
export const BINARY_DATA_STORAGE_PATH = 'MNI_BINARY_DATA_STORAGE_PATH';
export const UM_EMAIL_TEMPLATES_INVITE = 'MNI_UM_EMAIL_TEMPLATES_INVITE';
export const UM_EMAIL_TEMPLATES_PWRESET = 'MNI_UM_EMAIL_TEMPLATES_PWRESET';

export const CREDENTIAL_ERRORS = {
	NO_DATA: 'No data is set on this credentials.',
	DECRYPTION_FAILED:
		'Credentials could not be decrypted. The likely reason is that a different "encryptionKey" was used to encrypt the data.',
	INVALID_JSON: 'Decrypted credentials data is not valid JSON.',
	INVALID_DATA: 'Credentials data is not in a valid format.',
};

export const WAITING_TOKEN_QUERY_PARAM = 'signature';
