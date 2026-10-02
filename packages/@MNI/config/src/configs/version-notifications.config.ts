import { Config, Env } from '../decorators';

@Config
export class VersionNotificationsConfig {
	/** Whether to check for and show in-app notifications about new MNI versions. */
	@Env('MNI_VERSION_NOTIFICATIONS_ENABLED')
	enabled: boolean = true;

	/** URL used to fetch current MNI version information. */
	@Env('MNI_VERSION_NOTIFICATIONS_ENDPOINT')
	endpoint: string = 'https://api.n8n.io/api/versions/';

	/** Whether to fetch and show "What's New" content. Requires version notifications to be enabled. */
	@Env('MNI_VERSION_NOTIFICATIONS_WHATS_NEW_ENABLED')
	whatsNewEnabled: boolean = true;

	/** URL used to fetch "What's New" articles. */
	@Env('MNI_VERSION_NOTIFICATIONS_WHATS_NEW_ENDPOINT')
	whatsNewEndpoint: string = 'https://api.n8n.io/api/whats-new';

	/** URL linked from the versions panel (for example, upgrade instructions). */
	@Env('MNI_VERSION_NOTIFICATIONS_INFO_URL')
	infoUrl: string = 'https://docs.n8n.io/hosting/installation/updating/';
}
