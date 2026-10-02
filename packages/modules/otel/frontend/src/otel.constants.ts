import { OTLP_PROTOCOLS, type OtlpProtocol } from '@MNI/api-types';

export { OTLP_PROTOCOLS, type OtlpProtocol };

export const OTEL_STORE = 'otel';

/**
 * Mirrors CREDENTIAL_BLANKING_VALUE from MNI-workflow (not a dependency of this
 * module) — the placeholder the API returns in place of each header value.
 * Keys come back as-is; only values are blanked.
 */
export const CREDENTIALS_BLANKING_VALUE = '__MNI_BLANK_VALUE_e5362baf-c777-4d57-a609-6eaf1f9e87f6';

/**
 * Route name for the OpenTelemetry settings page. Owned by this module rather
 * than by the shared `VIEWS` enum, so the module can be packaged without the
 * shell holding one of its identifiers. The value is unchanged, so existing
 * URLs and telemetry keep resolving.
 */
export const OTEL_SETTINGS_VIEW = 'SettingsOpenTelemetryView';

/** Name of the span emitted by the "Send test trace" button — shown in the result copy. */
export const OTEL_TEST_SPAN_NAME = 'n8n.test_trace';

/** Maps each settings field to its env-var name — shown in per-field tooltips. */
export const OTEL_FIELD_ENV_VARS = {
	enabled: 'MNI_OTEL_ENABLED',
	exporterProtocol: 'MNI_OTEL_EXPORTER_OTLP_PROTOCOL',
	exporterEndpoint: 'MNI_OTEL_EXPORTER_OTLP_ENDPOINT',
	exporterTracingPath: 'MNI_OTEL_EXPORTER_OTLP_TRACING_PATH',
	exporterServiceName: 'MNI_OTEL_EXPORTER_SERVICE_NAME',
	exporterHeaders: 'MNI_OTEL_EXPORTER_OTLP_HEADERS',
	tracesSampleRate: 'MNI_OTEL_TRACES_SAMPLE_RATE',
	startupConnectivityTimeoutMs: 'MNI_OTEL_STARTUP_CONNECTIVITY_TIMEOUT_MS',
	includeNodeSpans: 'MNI_OTEL_TRACES_INCLUDE_NODE_SPANS',
	injectOutbound: 'MNI_OTEL_TRACES_INJECT_OUTBOUND',
	productionExecutionsOnly: 'MNI_OTEL_TRACES_PRODUCTION_ONLY',
} as const;
