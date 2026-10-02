import { z } from 'zod';

import { Config, Env, Nested } from '../decorators';
import { PasswordConfig } from './password.config';

@Config
class SmtpAuth {
	/** SMTP login username */
	@Env('MNI_SMTP_USER')
	user: string = '';

	/** SMTP login password */
	@Env('MNI_SMTP_PASS')
	pass: string = '';

	/** SMTP OAuth Service Client */
	@Env('MNI_SMTP_OAUTH_SERVICE_CLIENT')
	serviceClient: string = '';

	/** SMTP OAuth Private Key */
	@Env('MNI_SMTP_OAUTH_PRIVATE_KEY')
	privateKey: string = '';
}

@Config
class SmtpConfig {
	/** SMTP server host */
	@Env('MNI_SMTP_HOST')
	host: string = '';

	/** SMTP server port */
	@Env('MNI_SMTP_PORT')
	port: number = 465;

	/** Whether to use SSL for SMTP */
	@Env('MNI_SMTP_SSL')
	secure: boolean = true;

	/** Whether to use STARTTLS for SMTP when SSL is disabled */
	@Env('MNI_SMTP_STARTTLS')
	startTLS: boolean = true;

	/** How to display sender name */
	@Env('MNI_SMTP_SENDER')
	sender: string = '';

	@Nested
	auth: SmtpAuth;
}

@Config
export class TemplateConfig {
	/** Overrides default HTML template for inviting new people (use full path) */
	@Env('MNI_UM_EMAIL_TEMPLATES_INVITE')
	'user-invited': string = '';

	/** Overrides default HTML template for resetting password (use full path) */
	@Env('MNI_UM_EMAIL_TEMPLATES_PWRESET')
	'password-reset-requested': string = '';

	/** Overrides default HTML template for notifying that a workflow was shared (use full path) */
	@Env('MNI_UM_EMAIL_TEMPLATES_WORKFLOW_SHARED')
	'workflow-shared': string = '';

	/** Overrides default HTML template for notifying that a workflow was deactivated (use full path) */
	@Env('MNI_UM_EMAIL_TEMPLATES_WORKFLOW_AUTODEACTIVATED')
	'workflow-deactivated': string = '';

	/** Overrides default HTML template for notifying that credentials were shared (use full path) */
	@Env('MNI_UM_EMAIL_TEMPLATES_CREDENTIALS_SHARED')
	'credentials-shared': string = '';

	/** Overrides default HTML template for notifying that credentials were shared (use full path) */
	@Env('MNI_UM_EMAIL_TEMPLATES_PROJECT_SHARED')
	'project-shared': string = '';

	/** Overrides default HTML template for notifying that a workflow failed in production (use full path) */
	@Env('MNI_UM_EMAIL_TEMPLATES_WORKFLOW_FAILURE')
	'workflow-failure': string = '';

	/** Overrides default HTML template for notifying a user that their public API key was revoked by an admin (use full path) */
	@Env('MNI_UM_EMAIL_TEMPLATES_API_KEY_REVOKED')
	'api-key-revoked': string = '';

	/** Overrides default HTML template for notifying a user that their connected MCP client was revoked by an admin (use full path) */
	@Env('MNI_UM_EMAIL_TEMPLATES_MCP_CLIENT_REVOKED')
	'mcp-client-revoked': string = '';

	/** Overrides default HTML template for confirming an email change (use full path) */
	@Env('MNI_UM_EMAIL_TEMPLATES_EMAIL_CHANGE_REQUESTED')
	'email-change-requested': string = '';

	/** Overrides default HTML template for the email-change completion notice (use full path) */
	@Env('MNI_UM_EMAIL_TEMPLATES_EMAIL_CHANGE_COMPLETED')
	'email-change-completed': string = '';
}

const emailModeSchema = z.enum(['', 'smtp']);
type EmailMode = z.infer<typeof emailModeSchema>;

@Config
class EmailConfig {
	/** Email delivery method: `smtp` or empty (disabled). */
	@Env('MNI_EMAIL_MODE', emailModeSchema)
	mode: EmailMode = 'smtp';

	@Nested
	smtp: SmtpConfig;

	@Nested
	template: TemplateConfig;
}

const INVALID_JWT_REFRESH_TIMEOUT_WARNING =
	'MNI_USER_MANAGEMENT_JWT_REFRESH_TIMEOUT_HOURS needs to be smaller than MNI_USER_MANAGEMENT_JWT_DURATION_HOURS. Setting MNI_USER_MANAGEMENT_JWT_REFRESH_TIMEOUT_HOURS to 0.';

@Config
export class UserManagementConfig {
	@Nested
	emails: EmailConfig;

	@Nested
	password: PasswordConfig;

	/** JWT secret to use. If unset, MNI will generate its own. */
	@Env('MNI_USER_MANAGEMENT_JWT_SECRET')
	jwtSecret: string = '';

	/** How long (in hours) before the JWT expires. */
	@Env('MNI_USER_MANAGEMENT_JWT_DURATION_HOURS')
	jwtSessionDurationHours: number = 168;

	/**
	 * Security Control: Invite Link Exposure Prevention
	 *
	 * When enabled, prevents exposure of invite URLs in API responses to users
	 * with 'user:create' permission, mitigating account takeover risks via
	 * invite link leakage (e.g., compromised admin accounts, network interception).
	 */
	@Env('MNI_INVITE_LINKS_EMAIL_ONLY')
	inviteLinksEmailOnly: boolean = false;

	/**
	 * How long (in hours) before expiration to automatically refresh it.
	 * - `0` means 25% of `MNI_USER_MANAGEMENT_JWT_DURATION_HOURS`.
	 * - `-1` means it will never refresh. This forces users to log back in after expiration.
	 */
	@Env('MNI_USER_MANAGEMENT_JWT_REFRESH_TIMEOUT_HOURS')
	jwtRefreshTimeoutHours: number = 0;

	sanitize() {
		if (this.jwtRefreshTimeoutHours >= this.jwtSessionDurationHours) {
			console.warn(INVALID_JWT_REFRESH_TIMEOUT_WARNING);
			this.jwtRefreshTimeoutHours = 0;
		}
	}
}
