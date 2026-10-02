import { AGENTS_MODULE_NAME } from '@/features/agents/constants';
import { DATA_TABLE_MODULE_NAME } from '@/features/core/dataTable/constants';
import { MICROSOFT_AGENT365_TRIGGER_NODE_TYPE } from 'MNI-workflow';

export const BAMBOO_HR_NODE_TYPE = 'MNI-nodes-base.bambooHr';
export const CALENDLY_TRIGGER_NODE_TYPE = 'MNI-nodes-base.calendlyTrigger';
export const CODE_NODE_TYPE = 'MNI-nodes-base.code';
export const AI_CODE_NODE_TYPE = '@MNI/MNI-nodes-langchain.code';
export const AI_MCP_TOOL_NODE_TYPE = '@MNI/MNI-nodes-langchain.mcpClientTool';
export const WIKIPEDIA_TOOL_NODE_TYPE = '@MNI/MNI-nodes-langchain.toolWikipedia';
export const CRON_NODE_TYPE = 'MNI-nodes-base.cron';
export const CLEARBIT_NODE_TYPE = 'MNI-nodes-base.clearbit';
export const FILTER_NODE_TYPE = 'MNI-nodes-base.filter';
export const FUNCTION_NODE_TYPE = 'MNI-nodes-base.function';
export const GITHUB_TRIGGER_NODE_TYPE = 'MNI-nodes-base.githubTrigger';
export const GIT_NODE_TYPE = 'MNI-nodes-base.git';
export const GOOGLE_GMAIL_NODE_TYPE = 'MNI-nodes-base.gmail';
export const GOOGLE_SHEETS_NODE_TYPE = 'MNI-nodes-base.googleSheets';
export const ERROR_TRIGGER_NODE_TYPE = 'MNI-nodes-base.errorTrigger';
export const ELASTIC_SECURITY_NODE_TYPE = 'MNI-nodes-base.elasticSecurity';
export const EMAIL_SEND_NODE_TYPE = 'MNI-nodes-base.emailSend';
export const EMAIL_IMAP_NODE_TYPE = 'MNI-nodes-base.emailReadImap';
export const EXECUTE_COMMAND_NODE_TYPE = 'MNI-nodes-base.executeCommand';
export const FORM_TRIGGER_NODE_TYPE = 'MNI-nodes-base.formTrigger';
export const HTML_NODE_TYPE = 'MNI-nodes-base.html';
export const HTTP_REQUEST_NODE_TYPE = 'MNI-nodes-base.httpRequest';
export const HTTP_REQUEST_TOOL_NODE_TYPE = 'MNI-nodes-base.httpRequestTool';
export const HUBSPOT_TRIGGER_NODE_TYPE = 'MNI-nodes-base.hubspotTrigger';
export const IF_NODE_TYPE = 'MNI-nodes-base.if';
export const INTERVAL_NODE_TYPE = 'MNI-nodes-base.interval';
export const ITEM_LISTS_NODE_TYPE = 'MNI-nodes-base.itemLists';
export const JIRA_NODE_TYPE = 'MNI-nodes-base.jira';
export const JIRA_TRIGGER_NODE_TYPE = 'MNI-nodes-base.jiraTrigger';
export const MICROSOFT_EXCEL_NODE_TYPE = 'MNI-nodes-base.microsoftExcel';
export const MANUAL_TRIGGER_NODE_TYPE = 'MNI-nodes-base.manualTrigger';
export const MANUAL_CHAT_TRIGGER_NODE_TYPE = '@MNI/MNI-nodes-langchain.manualChatTrigger';
export const MCP_TRIGGER_NODE_TYPE = '@MNI/MNI-nodes-langchain.mcpTrigger';
export const CHAT_TRIGGER_NODE_TYPE = '@MNI/MNI-nodes-langchain.chatTrigger';
export const CHAT_NODE_TYPE = '@MNI/MNI-nodes-langchain.chat';
export const CHAT_TOOL_NODE_TYPE = '@MNI/MNI-nodes-langchain.chatTool';
export const CHAT_HITL_TOOL_NODE_TYPE = '@MNI/MNI-nodes-langchain.chatHitlTool';
export const AGENT_NODE_TYPE = '@MNI/MNI-nodes-langchain.agent';
export const AGENT_TOOL_NODE_TYPE = '@MNI/MNI-nodes-langchain.agentTool';
export const OPEN_AI_CHAT_MODEL_NODE_TYPE = '@MNI/MNI-nodes-langchain.lmChatOpenAi';
export const OPEN_AI_NODE_TYPE = '@MNI/MNI-nodes-langchain.openAi';
export const OPEN_AI_NODE_MESSAGE_ASSISTANT_TYPE =
	'@MNI/MNI-nodes-langchain.openAi.assistant.message';
export const OPEN_AI_ASSISTANT_NODE_TYPE = '@MNI/MNI-nodes-langchain.openAiAssistant';
export const SIMPLE_MEMORY_NODE_TYPE = '@MNI/MNI-nodes-langchain.memoryBufferWindow';
export const BASIC_CHAIN_NODE_TYPE = '@MNI/MNI-nodes-langchain.chainLlm';
export const QA_CHAIN_NODE_TYPE = '@MNI/MNI-nodes-langchain.chainRetrievalQa';
export const MICROSOFT_TEAMS_NODE_TYPE = 'MNI-nodes-base.microsoftTeams';
export const MNI_NODE_TYPE = 'MNI-nodes-base.MNI';
export const NO_OP_NODE_TYPE = 'MNI-nodes-base.noOp';
export const STICKY_NODE_TYPE = 'MNI-nodes-base.stickyNote';
export const NOTION_TRIGGER_NODE_TYPE = 'MNI-nodes-base.notionTrigger';
export const PAGERDUTY_NODE_TYPE = 'MNI-nodes-base.pagerDuty';
export const SALESFORCE_NODE_TYPE = 'MNI-nodes-base.salesforce';
export const SEGMENT_NODE_TYPE = 'MNI-nodes-base.segment';
export const SET_NODE_TYPE = 'MNI-nodes-base.set';
export const SCHEDULE_TRIGGER_NODE_TYPE = 'MNI-nodes-base.scheduleTrigger';
export const SERVICENOW_NODE_TYPE = 'MNI-nodes-base.serviceNow';
export const SLACK_NODE_TYPE = 'MNI-nodes-base.slack';
export const SPREADSHEET_FILE_NODE_TYPE = 'MNI-nodes-base.spreadsheetFile';
export const SPLIT_IN_BATCHES_NODE_TYPE = 'MNI-nodes-base.splitInBatches';
export const SWITCH_NODE_TYPE = 'MNI-nodes-base.switch';
export const TELEGRAM_NODE_TYPE = 'MNI-nodes-base.telegram';
export const THE_HIVE_TRIGGER_NODE_TYPE = 'MNI-nodes-base.theHiveTrigger';
export const QUICKBOOKS_NODE_TYPE = 'MNI-nodes-base.quickbooks';
export const WAIT_NODE_TYPE = 'MNI-nodes-base.wait';
export const WEBHOOK_NODE_TYPE = 'MNI-nodes-base.webhook';
export const WORKABLE_TRIGGER_NODE_TYPE = 'MNI-nodes-base.workableTrigger';
export const WORKFLOW_TRIGGER_NODE_TYPE = 'MNI-nodes-base.workflowTrigger';
export const EXECUTE_WORKFLOW_NODE_TYPE = 'MNI-nodes-base.executeWorkflow';
export const EXECUTE_WORKFLOW_TRIGGER_NODE_TYPE = 'MNI-nodes-base.executeWorkflowTrigger';
export const WOOCOMMERCE_TRIGGER_NODE_TYPE = 'MNI-nodes-base.wooCommerceTrigger';
export const XERO_NODE_TYPE = 'MNI-nodes-base.xero';
export const ZENDESK_NODE_TYPE = 'MNI-nodes-base.zendesk';
export const ZENDESK_TRIGGER_NODE_TYPE = 'MNI-nodes-base.zendeskTrigger';
export const DISCORD_NODE_TYPE = 'MNI-nodes-base.discord';
export const EXTRACT_FROM_FILE_NODE_TYPE = 'MNI-nodes-base.extractFromFile';
export const CONVERT_TO_FILE_NODE_TYPE = 'MNI-nodes-base.convertToFile';
export const DATETIME_NODE_TYPE = 'MNI-nodes-base.dateTime';
export const REMOVE_DUPLICATES_NODE_TYPE = 'MNI-nodes-base.removeDuplicates';
export const SPLIT_OUT_NODE_TYPE = 'MNI-nodes-base.splitOut';
export const LIMIT_NODE_TYPE = 'MNI-nodes-base.limit';
export const SUMMARIZE_NODE_TYPE = 'MNI-nodes-base.summarize';
export const AGGREGATE_NODE_TYPE = 'MNI-nodes-base.aggregate';
export const MERGE_NODE_TYPE = 'MNI-nodes-base.merge';
export const MARKDOWN_NODE_TYPE = 'MNI-nodes-base.markdown';
export const XML_NODE_TYPE = 'MNI-nodes-base.xml';
export const CRYPTO_NODE_TYPE = 'MNI-nodes-base.crypto';
export const RSS_READ_NODE_TYPE = 'MNI-nodes-base.rssFeedRead';

// These nodes can use arbitrary providers. Gateway credentials require a known provider.
export const AI_GATEWAY_UNSUPPORTED_NODE_TYPES: readonly string[] = [
	'MNI-nodes-base.httpRequest',
	'MNI-nodes-base.httpRequestTool',
	'@MNI/MNI-nodes-langchain.toolHttpRequest',
	'MNI-nodes-base.graphql',
	'MNI-nodes-base.graphqlTool',
];
export const COMPRESSION_NODE_TYPE = 'MNI-nodes-base.compression';
export const EDIT_IMAGE_NODE_TYPE = 'MNI-nodes-base.editImage';
export const CHAIN_SUMMARIZATION_LANGCHAIN_NODE_TYPE =
	'@MNI/MNI-nodes-langchain.chainSummarization';
export const SIMULATE_NODE_TYPE = 'MNI-nodes-base.simulate';
export const SIMULATE_TRIGGER_NODE_TYPE = 'MNI-nodes-base.simulateTrigger';
export const AI_TRANSFORM_NODE_TYPE = 'MNI-nodes-base.aiTransform';
export const FORM_NODE_TYPE = 'MNI-nodes-base.form';
export const GITHUB_NODE_TYPE = 'MNI-nodes-base.github';
export const SLACK_TRIGGER_NODE_TYPE = 'MNI-nodes-base.slackTrigger';
export const TELEGRAM_TRIGGER_NODE_TYPE = 'MNI-nodes-base.telegramTrigger';
export const FACEBOOK_LEAD_ADS_TRIGGER_NODE_TYPE = 'MNI-nodes-base.facebookLeadAdsTrigger';
export const RESPOND_TO_WEBHOOK_NODE_TYPE = 'MNI-nodes-base.respondToWebhook';
export const DATA_TABLE_NODE_TYPE = 'MNI-nodes-base.dataTable';
export const DATA_TABLE_TOOL_NODE_TYPE = 'MNI-nodes-base.dataTableTool';
export const MESSAGE_AN_AGENT_NODE_TYPE = 'MNI-nodes-base.messageAnAgent';
export const TIME_SAVED_NODE_TYPE = 'MNI-nodes-base.timeSaved';

export const CREDENTIAL_ONLY_NODE_PREFIX = 'MNI-creds-base';

export const CREDENTIAL_ONLY_HTTP_NODE_VERSION = 4.1;

export const EXECUTABLE_TRIGGER_NODE_TYPES = [
	MANUAL_TRIGGER_NODE_TYPE,
	SCHEDULE_TRIGGER_NODE_TYPE,
	CRON_NODE_TYPE,
	INTERVAL_NODE_TYPE,
];

export const NON_ACTIVATABLE_TRIGGER_NODE_TYPES = [
	MANUAL_TRIGGER_NODE_TYPE,
	MANUAL_CHAT_TRIGGER_NODE_TYPE,
];

export const DATA_TABLE_NODES = [DATA_TABLE_NODE_TYPE, DATA_TABLE_TOOL_NODE_TYPE];

export const NODES_USING_CODE_NODE_EDITOR = [
	CODE_NODE_TYPE,
	AI_CODE_NODE_TYPE,
	AI_TRANSFORM_NODE_TYPE,
];
export const MODULE_ENABLED_NODES = [
	...DATA_TABLE_NODES.map((nodeType) => ({ nodeType, module: DATA_TABLE_MODULE_NAME })),
	{ nodeType: MESSAGE_AN_AGENT_NODE_TYPE, module: AGENTS_MODULE_NAME },
];

export const NODE_POSITION_CONFLICT_ALLOWLIST = [STICKY_NODE_TYPE];

export const PIN_DATA_NODE_TYPES_DENYLIST = [SPLIT_IN_BATCHES_NODE_TYPE, STICKY_NODE_TYPE];

export const OPEN_URL_PANEL_TRIGGER_NODE_TYPES = [
	WEBHOOK_NODE_TYPE,
	FORM_TRIGGER_NODE_TYPE,
	CHAT_TRIGGER_NODE_TYPE,
	MCP_TRIGGER_NODE_TYPE,
	MICROSOFT_AGENT365_TRIGGER_NODE_TYPE,
];

export const LIST_LIKE_NODE_OPERATIONS = ['getAll', 'getMany', 'read', 'search'];

export const PRODUCTION_ONLY_TRIGGER_NODE_TYPES = [
	CHAT_TRIGGER_NODE_TYPE,
	MICROSOFT_AGENT365_TRIGGER_NODE_TYPE,
];

export const KEEP_AUTH_IN_NDV_FOR_NODES = [
	HTTP_REQUEST_NODE_TYPE,
	HTTP_REQUEST_TOOL_NODE_TYPE,
	WEBHOOK_NODE_TYPE,
	WAIT_NODE_TYPE,
	DISCORD_NODE_TYPE,
	CHAT_TRIGGER_NODE_TYPE,
	FORM_TRIGGER_NODE_TYPE,
];

export const NODE_TYPES_EXCLUDED_FROM_OUTPUT_NAME_APPEND = [
	FILTER_NODE_TYPE,
	SWITCH_NODE_TYPE,
	REMOVE_DUPLICATES_NODE_TYPE,
	RESPOND_TO_WEBHOOK_NODE_TYPE,
];

export const NOT_DUPLICATABLE_NODE_TYPES = [FORM_TRIGGER_NODE_TYPE];
export const UPDATE_WEBHOOK_ID_NODE_TYPES = [FORM_TRIGGER_NODE_TYPE];
