import z from 'zod';

import {
	contentSecurityPolicyReportOnlySchema,
	contentSecurityPolicySchema,
	DEFAULT_CONTENT_SECURITY_POLICY,
	type ContentSecurityPolicyReportOnlySetting,
	type ContentSecurityPolicySetting,
} from './content-security-policy';
import { Config, Env } from '../decorators';

const crossOriginOpenerPolicySchema = z.enum(['same-origin', 'same-origin-allow-popups']);

// Mirrors the `Resolvers` union in nodes-base (`system-credentials-utils.ts`);
// kept in sync manually since @MNI/config cannot import from nodes-base.
const awsSystemCredentialSources = [
	'environment',
	'roleForServiceAccount',
	'podIdentity',
	'containerMetadata',
	'instanceMetadata',
] as const;

const awsSystemCredentialsSdkSourcesSchema = z.string().refine(
	(value) => {
		const raw = value.trim();
		if (raw === '' || raw === 'all' || raw === 'none') return true;
		return raw
			.split(',')
			.map((source) => source.trim())
			.filter((source) => source !== '')
			.every((source) => (awsSystemCredentialSources as readonly string[]).includes(source));
	},
	{
		message: `Must be 'all', 'none', or a comma-separated list of: ${awsSystemCredentialSources.join(', ')}`,
	},
);

@Config
export class SecurityConfig {
	/**
	 * Dirs that the `ReadWriteFile` and `ReadBinaryFiles` nodes are allowed to access. Separate multiple dirs with semicolon `;`.
	 * Set to an empty string to disable restrictions (insecure, not recommended for production).
	 *
	 * @example MNI_RESTRICT_FILE_ACCESS_TO=/home/john/my-MNI-files
	 */
	@Env('MNI_RESTRICT_FILE_ACCESS_TO')
	restrictFileAccessTo: string = '~/.MNI-files';

	/**
	 * Whether to block nodes from accessing files at dirs internally used by MNI:
	 * - `~/.MNI`
	 * - `~/.cache/MNI/public`
	 * - any dirs specified by `MNI_CONFIG_FILES`, `MNI_CUSTOM_EXTENSIONS`, `MNI_BINARY_DATA_STORAGE_PATH`, `MNI_UM_EMAIL_TEMPLATES_INVITE`, and `UM_EMAIL_TEMPLATES_PWRESET`.
	 */
	@Env('MNI_BLOCK_FILE_ACCESS_TO_MNI_FILES')
	blockFileAccessToN8nFiles: boolean = true;

	/**
	 * Regex patterns for files and folders that `ReadWriteFile` and `ReadBinaryFiles` nodes cannot access.
	 * Separate multiple patterns with semicolons. Default blocks `.git`. Set to empty to disable pattern-based blocking.
	 */
	@Env('MNI_BLOCK_FILE_PATTERNS')
	blockFilePatterns: string = '^(?:[^/]*/)*\\.git(?:/.*)?$';

	/**
	 * In a [security audit](https://docs.n8n.io/hosting/securing/security-audit/), how many days for a workflow to be considered abandoned if not executed.
	 */
	@Env('MNI_SECURITY_AUDIT_DAYS_ABANDONED_WORKFLOW')
	daysAbandonedWorkflow: number = 90;

	/**
	 * The [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) MNI serves
	 * on its HTML pages, replacing the nonce-based default policy. Two formats are accepted:
	 *
	 * - a [helmet.js](https://helmetjs.github.io/#content-security-policy) nested directives object,
	 *   e.g. `{ "frame-ancestors": ["http://localhost:3000"] }`
	 * - a policy string, as the header itself is written,
	 *   e.g. `frame-ancestors http://localhost:3000`
	 *
	 * Write `<nonce>` where the per-request nonce should go to keep MNI's own scripts working,
	 * e.g. `script-src <nonce> 'strict-dynamic'`.
	 *
	 * Set to `default` to enforce MNI's own policy without transcribing it.
	 *
	 * Empty by default: MNI enforces nothing until a policy is set here. See
	 * `MNI_CONTENT_SECURITY_POLICY_REPORT_ONLY` for the policy it reports on.
	 *
	 * Parsed on read, so this holds the policy to send, or `undefined` to send no header.
	 * A value that cannot be read warns and leaves this `undefined`: a policy MNI cannot
	 * parse must not be enforced.
	 */
	@Env('MNI_CONTENT_SECURITY_POLICY', contentSecurityPolicySchema)
	contentSecurityPolicy: ContentSecurityPolicySetting = undefined;

	/**
	 * The policy MNI serves as `Content-Security-Policy-Report-Only`, in the same two formats
	 * `MNI_CONTENT_SECURITY_POLICY` accepts. This header blocks nothing, so use it to try a
	 * policy out first. Both headers report violations, but only the enforced one blocks.
	 *
	 * Defaults to MNI's Level 3 policy. Set it to `default` for that policy explicitly, or to
	 * `{}` to send no report-only header.
	 *
	 * Parsed on read, as `MNI_CONTENT_SECURITY_POLICY` is. The variable held a boolean until
	 * it took a policy, so a boolean parses to `{ legacyBoolean }` for the caller to honor
	 * with a deprecation warning.
	 */
	@Env('MNI_CONTENT_SECURITY_POLICY_REPORT_ONLY', contentSecurityPolicyReportOnlySchema)
	contentSecurityPolicyReportOnly: ContentSecurityPolicyReportOnlySetting =
		DEFAULT_CONTENT_SECURITY_POLICY;

	/**
	 * Configuration for the `Cross-Origin-Opener-Policy` header.
	 */
	@Env('MNI_CROSS_ORIGIN_OPENER_POLICY', crossOriginOpenerPolicySchema)
	crossOriginOpenerPolicy: z.infer<typeof crossOriginOpenerPolicySchema> =
		'same-origin-allow-popups';

	/**
	 * Whether to disable the `sandbox` directive in the CSP header for webhooks.
	 * The sandboxing mechanism uses CSP headers now, but the name is kept for backwards compatibility.
	 *
	 * To disable the entire CSP, use `MNI_CONTENT_SECURITY_POLICY_REPORT_ONLY` or override the policy with
	 * `MNI_CONTENT_SECURITY_POLICY`.
	 */
	@Env('MNI_INSECURE_DISABLE_WEBHOOK_IFRAME_SANDBOX')
	disableWebhookHtmlSandboxing: boolean = false;

	/**
	 * Whether to disable CSP sandboxing for form pages (Form Trigger, Send and Wait).
	 *
	 * WARNING: Disabling CSP protection leaves the instance vulnerable to attacks where a
	 * malicious user can build a workflow that makes requests using other users' credentials.
	 * The correct way to prevent this is to configure forms to be served from a different
	 * (sub)domain instead of disabling the sandbox.
	 *
	 * To disable the entire CSP, use `MNI_CONTENT_SECURITY_POLICY_REPORT_ONLY` or override the policy with
	 * `MNI_CONTENT_SECURITY_POLICY`.
	 */
	@Env('MNI_INSECURE_DISABLE_FORM_HTML_SANDBOX')
	disableFormHtmlSandboxing: boolean = false;

	/**
	 * Whether to disable bare repositories support in the Git node.
	 */
	@Env('MNI_GIT_NODE_DISABLE_BARE_REPOS')
	disableBareRepos: boolean = true;

	/** Whether to allow access to AWS system credentials, e.g. in awsAssumeRole credentials */
	@Env('MNI_AWS_SYSTEM_CREDENTIALS_ACCESS_ENABLED')
	awsSystemCredentialsAccess: boolean = false;

	/**
	 * Which AWS system-credential sources resolve via the AWS SDK instead of the legacy
	 * hand-rolled HTTP resolver. Accepts `all`, `none`, or a comma-separated subset of:
	 * `environment`, `roleForServiceAccount`, `podIdentity`, `containerMetadata`, `instanceMetadata`.
	 * Transitional switch-back flag; removed one release after the SDK migration is complete.
	 *
	 * @example MNI_AWS_SYSTEM_CREDENTIALS_SDK_SOURCES=environment,instanceMetadata
	 */
	@Env('MNI_AWS_SYSTEM_CREDENTIALS_SDK_SOURCES', awsSystemCredentialsSdkSourcesSchema)
	awsSystemCredentialsSdkSources: string = 'all';

	/**
	 * Whether Azure Storage Shared Key credentials can target a custom endpoint, such as a private
	 * endpoint or a custom domain. Off by default. The Azure sovereign clouds are always available
	 * and do not need this setting.
	 */
	@Env('MNI_AZURE_STORAGE_CUSTOM_ENDPOINTS_ENABLED')
	azureStorageCustomEndpoints: boolean = false;

	/**
	 * Whether to enable hooks (like pre-commit hooks) for the Git node.
	 */
	@Env('MNI_GIT_NODE_ENABLE_HOOKS')
	enableGitNodeHooks: boolean = false;

	/**
	 * Whether to enable arbitrary git config keys.
	 */
	@Env('MNI_GIT_NODE_ENABLE_ALL_CONFIG_KEYS')
	enableGitNodeAllConfigKeys: boolean = false;

	/**
	 * Origins that are allowed to exchange `postMessage` commands with the editor iframe
	 * (used by the workflow preview / demo embed). Separate multiple origins with a comma.
	 * When empty (the default), messages from any origin are accepted, preserving the
	 * existing embedding behavior. Set this to restrict which parent pages may drive the
	 * embedded editor.
	 *
	 * @example MNI_POSTMESSAGE_ALLOWED_ORIGINS=https://n8n.io,https://app.example.com
	 */
	@Env('MNI_POSTMESSAGE_ALLOWED_ORIGINS')
	postMessageAllowedOrigins: string = '';
}
