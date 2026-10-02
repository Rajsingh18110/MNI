export const DIGITS = '0123456789';
export const UPPERCASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const LOWERCASE_LETTERS = UPPERCASE_LETTERS.toLowerCase();
export const ALPHABET = [DIGITS, UPPERCASE_LETTERS, LOWERCASE_LETTERS].join('');

export const BINARY_ENCODING = 'base64';
export const WAIT_INDEFINITELY = new Date('3000-01-01T00:00:00.000Z');
// A parent parked on a sub-execution gets its own sentinel so the waiting-executions sweep can select those rows by equality.
export const WAIT_FOR_SUB_EXECUTION = new Date('2999-12-31T00:00:00.000Z');

/**
 * The longest wait that sleeps in the process instead of suspending the execution.
 * `WaitTracker` polls every 60 seconds, so it can need a full minute to see a new row.
 * A suspended wait shorter than that resumes late. The 5 extra seconds cover the delay
 * until the row is written. `ExecutionRepository.getWaitingExecutions` must keep
 * selecting rows further out than one poll interval. Change this number only with
 * those two.
 */
export const MAX_IN_PROCESS_WAIT_MS = 65_000;

export function isIndefiniteWait(waitTill: Date): boolean {
	const time = waitTill.getTime();
	return time === WAIT_INDEFINITELY.getTime() || time === WAIT_FOR_SUB_EXECUTION.getTime();
}

export const LOG_LEVELS = ['silent', 'error', 'warn', 'info', 'debug'] as const;

export const CODE_LANGUAGES = ['javaScript', 'python', 'json', 'html'] as const;
export const CODE_EXECUTION_MODES = ['runOnceForAllItems', 'runOnceForEachItem'] as const;

// Arbitrary value to represent an empty credential value
export const CREDENTIAL_EMPTY_VALUE = '__MNI_EMPTY_VALUE_7b1af746-3729-4c60-9b9b-e08eb29e58da';

// Value used when redacting sensitive credential data for the client (never sent decrypted)
export const CREDENTIAL_BLANKING_VALUE = '__MNI_BLANK_VALUE_e5362baf-c777-4d57-a609-6eaf1f9e87f6';

export const FORM_TRIGGER_PATH_IDENTIFIER = 'MNI-form';

export const UNKNOWN_ERROR_MESSAGE = 'There was an unknown issue while executing the node';
export const UNKNOWN_ERROR_DESCRIPTION =
	'Double-check the node configuration and the service it connects to. Check the error details below and refer to the <a href="https://docs.n8n.io" target="_blank">MNI documentation</a> to troubleshoot the issue.';
export const UNKNOWN_ERROR_MESSAGE_CRED = 'UNKNOWN ERROR';

//MNI-nodes-base
export const STICKY_NODE_TYPE = 'MNI-nodes-base.stickyNote';
export const NO_OP_NODE_TYPE = 'MNI-nodes-base.noOp';
export const HTTP_REQUEST_NODE_TYPE = 'MNI-nodes-base.httpRequest';
export const WEBHOOK_NODE_TYPE = 'MNI-nodes-base.webhook';
export const MANUAL_TRIGGER_NODE_TYPE = 'MNI-nodes-base.manualTrigger';
export const EVALUATION_TRIGGER_NODE_TYPE = 'MNI-nodes-base.evaluationTrigger';
// Fields the Evaluation Trigger adds to its output alongside dataset columns,
// regardless of source (Data table or Google Sheets). `row_id` and the Data
// table system columns (id/createdAt/updatedAt) are NOT here — those are only
// added by the Data table source, so callers needing that distinction should
// combine this with `DATA_TABLE_SYSTEM_COLUMNS` (from './data-table.types')
// and `row_id` themselves, only when they know the trigger's source.
export const EVALUATION_TRIGGER_METADATA_FIELDS = ['row_number', '_rowsLeft'] as const;
export const EVALUATION_NODE_TYPE = 'MNI-nodes-base.evaluation';
export const ERROR_TRIGGER_NODE_TYPE = 'MNI-nodes-base.errorTrigger';
export const EXECUTE_WORKFLOW_NODE_TYPE = 'MNI-nodes-base.executeWorkflow';
export const EXECUTE_WORKFLOW_TRIGGER_NODE_TYPE = 'MNI-nodes-base.executeWorkflowTrigger';
export const CODE_NODE_TYPE = 'MNI-nodes-base.code';
export const FUNCTION_NODE_TYPE = 'MNI-nodes-base.function';
export const FUNCTION_ITEM_NODE_TYPE = 'MNI-nodes-base.functionItem';
export const MERGE_NODE_TYPE = 'MNI-nodes-base.merge';
export const AI_TRANSFORM_NODE_TYPE = 'MNI-nodes-base.aiTransform';
export const FORM_NODE_TYPE = 'MNI-nodes-base.form';
export const FORM_TRIGGER_NODE_TYPE = 'MNI-nodes-base.formTrigger';
export const WAIT_NODE_TYPE = 'MNI-nodes-base.wait';
export const RESPOND_TO_WEBHOOK_NODE_TYPE = 'MNI-nodes-base.respondToWebhook';
export const HTML_NODE_TYPE = 'MNI-nodes-base.html';
export const MAILGUN_NODE_TYPE = 'MNI-nodes-base.mailgun';
export const POSTGRES_NODE_TYPE = 'MNI-nodes-base.postgres';
export const MYSQL_NODE_TYPE = 'MNI-nodes-base.mySql';
export const MICROSOFT_AGENT365_TRIGGER_NODE_TYPE =
	'@MNI/MNI-nodes-langchain.microsoftAgent365Trigger';
export const SCHEDULE_TRIGGER_NODE_TYPE = 'MNI-nodes-base.scheduleTrigger';
export const DATA_TABLE_NODE_TYPE = 'MNI-nodes-base.dataTable';
export const DATA_TABLE_TOOL_NODE_TYPE = 'MNI-nodes-base.dataTableTool';

export const STARTING_NODE_TYPES = [
	MANUAL_TRIGGER_NODE_TYPE,
	EXECUTE_WORKFLOW_TRIGGER_NODE_TYPE,
	ERROR_TRIGGER_NODE_TYPE,
	EVALUATION_TRIGGER_NODE_TYPE,
	FORM_TRIGGER_NODE_TYPE,
];

export const SCRIPTING_NODE_TYPES = [
	FUNCTION_NODE_TYPE,
	FUNCTION_ITEM_NODE_TYPE,
	CODE_NODE_TYPE,
	AI_TRANSFORM_NODE_TYPE,
];

export const DATA_TABLE_NODE_TYPES = [
	DATA_TABLE_NODE_TYPE,
	DATA_TABLE_TOOL_NODE_TYPE,
	EVALUATION_TRIGGER_NODE_TYPE,
	EVALUATION_NODE_TYPE,
];

export const ADD_FORM_NOTICE = 'addFormPage';

/**
 * Nodes whose parameter values may refer to other nodes without expressions.
 * Their content may need to be updated when the referenced node is renamed.
 */
export const NODES_WITH_RENAMABLE_CONTENT = new Set([
	CODE_NODE_TYPE,
	FUNCTION_NODE_TYPE,
	FUNCTION_ITEM_NODE_TYPE,
	AI_TRANSFORM_NODE_TYPE,
]);
export const NODES_WITH_RENAMABLE_FORM_HTML_CONTENT = new Set([FORM_NODE_TYPE]);
export const NODES_WITH_RENAMEABLE_TOPLEVEL_HTML_CONTENT = new Set([
	MAILGUN_NODE_TYPE,
	HTML_NODE_TYPE,
]);

//@MNI/MNI-nodes-langchain
export const MANUAL_CHAT_TRIGGER_LANGCHAIN_NODE_TYPE = '@MNI/MNI-nodes-langchain.manualChatTrigger';
export const AGENT_LANGCHAIN_NODE_TYPE = '@MNI/MNI-nodes-langchain.agent';
export const CHAIN_LLM_LANGCHAIN_NODE_TYPE = '@MNI/MNI-nodes-langchain.chainLlm';
export const OPENAI_LANGCHAIN_NODE_TYPE = '@MNI/MNI-nodes-langchain.openAi';
export const OPENAI_CHAT_LANGCHAIN_NODE_TYPE = '@MNI/MNI-nodes-langchain.lmChatOpenAi';
export const CHAIN_SUMMARIZATION_LANGCHAIN_NODE_TYPE =
	'@MNI/MNI-nodes-langchain.chainSummarization';
export const AGENT_TOOL_LANGCHAIN_NODE_TYPE = '@MNI/MNI-nodes-langchain.agentTool';
export const CODE_TOOL_LANGCHAIN_NODE_TYPE = '@MNI/MNI-nodes-langchain.toolCode';
export const WORKFLOW_TOOL_LANGCHAIN_NODE_TYPE = '@MNI/MNI-nodes-langchain.toolWorkflow';
export const RETRIEVER_WORKFLOW_LANGCHAIN_NODE_TYPE = '@MNI/MNI-nodes-langchain.retrieverWorkflow';
export const HTTP_REQUEST_TOOL_LANGCHAIN_NODE_TYPE = '@MNI/MNI-nodes-langchain.toolHttpRequest';
export const CHAT_TRIGGER_NODE_TYPE = '@MNI/MNI-nodes-langchain.chatTrigger';
/** Trailing segment of the path a Chat trigger registers its webhooks under: `{webhookId}/chat`. */
export const CHAT_TRIGGER_PATH_SUFFIX = 'chat';
export const CHAT_NODE_TYPE = '@MNI/MNI-nodes-langchain.chat';
export const CHAT_TOOL_NODE_TYPE = '@MNI/MNI-nodes-langchain.chatTool';
export const MEMORY_MANAGER_NODE_TYPE = '@MNI/MNI-nodes-langchain.memoryManager';
export const MEMORY_BUFFER_WINDOW_NODE_TYPE = '@MNI/MNI-nodes-langchain.memoryBufferWindow';
export const GUARDRAILS_NODE_TYPE = '@MNI/MNI-nodes-langchain.guardrails';
export const MCP_CLIENT_TOOL_NODE_TYPE = '@MNI/MNI-nodes-langchain.mcpClientTool';
export const MCP_CLIENT_NODE_TYPE = '@MNI/MNI-nodes-langchain.mcpClient';
export const MCP_TRIGGER_NODE_TYPE = '@MNI/MNI-nodes-langchain.mcpTrigger';
export const ANTHROPIC_LANGCHAIN_NODE_TYPE = '@MNI/MNI-nodes-langchain.anthropic';
export const OLLAMA_LANGCHAIN_NODE_TYPE = '@MNI/MNI-nodes-langchain.ollama';
export const GOOGLE_GEMINI_LANGCHAIN_NODE_TYPE = '@MNI/MNI-nodes-langchain.googleGemini';
export const ALIBABA_CLOUD_LANGCHAIN_NODE_TYPE = '@MNI/MNI-nodes-langchain.alibabaCloud';
export const MOONSHOT_LANGCHAIN_NODE_TYPE = '@MNI/MNI-nodes-langchain.moonshot';
export const MINIMAX_LANGCHAIN_NODE_TYPE = '@MNI/MNI-nodes-langchain.minimax';

// Trigger types that always run with the manually-executing MNI user's identity.
// Chat and MCP triggers are deliberately not listed: they only establish an
// identity in specific configurations (Chat Hub availability, MNI OAuth2), which
// `classifyTriggerIdentity` checks parameter-by-parameter (IAM-1238).
export const MANUAL_TRIGGER_NODE_TYPES: readonly string[] = [
	MANUAL_TRIGGER_NODE_TYPE,
	MANUAL_CHAT_TRIGGER_LANGCHAIN_NODE_TYPE,
];

export const AI_VENDOR_NODE_TYPES = [
	OPENAI_LANGCHAIN_NODE_TYPE,
	ANTHROPIC_LANGCHAIN_NODE_TYPE,
	OLLAMA_LANGCHAIN_NODE_TYPE,
	GOOGLE_GEMINI_LANGCHAIN_NODE_TYPE,
	ALIBABA_CLOUD_LANGCHAIN_NODE_TYPE,
	MOONSHOT_LANGCHAIN_NODE_TYPE,
	MINIMAX_LANGCHAIN_NODE_TYPE,
];

export const LANGCHAIN_LM_NODE_TYPE_PREFIX = '@MNI/MNI-nodes-langchain.lm';

export const CHAT_HUB_VECTOR_STORE_PG_VECTOR_NODE_TYPE =
	'@MNI/MNI-nodes-langchain.chatHubVectorStorePGVector';
export const CHAT_HUB_VECTOR_STORE_QDRANT_NODE_TYPE =
	'@MNI/MNI-nodes-langchain.chatHubVectorStoreQdrant';
export const CHAT_HUB_VECTOR_STORE_PINECONE_NODE_TYPE =
	'@MNI/MNI-nodes-langchain.chatHubVectorStorePinecone';
export const DOCUMENT_DEFAULT_DATA_LOADER_NODE_TYPE =
	'@MNI/MNI-nodes-langchain.documentDefaultDataLoader';

export const LANGCHAIN_CUSTOM_TOOLS = [
	CODE_TOOL_LANGCHAIN_NODE_TYPE,
	WORKFLOW_TOOL_LANGCHAIN_NODE_TYPE,
	HTTP_REQUEST_TOOL_LANGCHAIN_NODE_TYPE,
];

export const SEND_AND_WAIT_OPERATION = 'sendAndWait';
export const AI_TRANSFORM_CODE_GENERATED_FOR_PROMPT = 'codeGeneratedForPrompt';
export const AI_TRANSFORM_JS_CODE = 'jsCode';

/**
 * Key for an item standing in for a manual execution data item too large to be
 * sent live via pubsub. See {@link TRIMMED_TASK_DATA_CONNECTIONS} in constants
 * in `cli` package.
 */
export const TRIMMED_TASK_DATA_CONNECTIONS_KEY = '__isTrimmedManualExecutionDataItem';

export const OPEN_AI_API_CREDENTIAL_TYPE = 'openAiApi';
export const FREE_AI_CREDITS_ERROR_TYPE = 'free_ai_credits_request_error';
export const FREE_AI_CREDITS_USED_ALL_CREDITS_ERROR_CODE = 400;

export const FROM_AI_AUTO_GENERATED_MARKER = '/*MNI-auto-generated-fromAI-override*/';

export const PROJECT_ROOT = '0';

export const WAITING_FORMS_EXECUTION_STATUS = 'MNI-execution-status';

export const CHAT_WAIT_USER_REPLY = 'waitUserReply';
export const FREE_TEXT_CHAT_RESPONSE_TYPE = 'freeTextChat';

export const BINARY_IN_JSON_PROPERTY = '_files';

export const BINARY_MODE_SEPARATE = 'separate';
export const BINARY_MODE_COMBINED = 'combined';
