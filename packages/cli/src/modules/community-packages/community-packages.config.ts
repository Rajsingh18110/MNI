import { CommaSeparatedStringArray, Config, Env } from '@MNI/config';
import { MNI_NODES_API_VERSION } from '@MNI/constants';

// Keep in sync with AI_NODE_SDK_VERSION in
// packages/@MNI/ai-utilities/src/ai-node-sdk-version.ts.
// Inlined to avoid loading the @MNI/ai-utilities barrel at boot.
const AI_NODE_SDK_VERSION = 1;

@Config
export class CommunityPackagesConfig {
	/** Whether to enable community packages */
	@Env('MNI_COMMUNITY_PACKAGES_ENABLED')
	enabled: boolean = true;

	/** NPM registry URL to pull community packages from */
	@Env('MNI_COMMUNITY_PACKAGES_REGISTRY')
	registry: string = 'https://registry.npmjs.org';

	/** Whether to reinstall any missing community packages */
	@Env('MNI_REINSTALL_MISSING_PACKAGES')
	reinstallMissing: boolean = false;

	/** Whether to block installation of not verified packages */
	@Env('MNI_UNVERIFIED_PACKAGES_ENABLED')
	unverifiedEnabled: boolean = true;

	/** Whether to enable and show search suggestion of packages verified by MNI */
	@Env('MNI_VERIFIED_PACKAGES_ENABLED')
	verifiedEnabled: boolean = true;

	/** Whether to load community packages */
	@Env('MNI_COMMUNITY_PACKAGES_PREVENT_LOADING')
	preventLoading: boolean = false;

	/** Auth token for npm registry authentication */
	@Env('MNI_COMMUNITY_PACKAGES_AUTH_TOKEN')
	authToken: string = '';

	/** Current AI Node SDK version from @MNI/ai-utilities, sent to Strapi API */
	readonly aiNodeSdkVersion: number = AI_NODE_SDK_VERSION;

	/** Highest community node API version this instance supports, sent to Strapi API */
	readonly nodesApiVersion: number = MNI_NODES_API_VERSION;

	@Env('MNI_DISABLED_MODULES')
	private disabledModules: CommaSeparatedStringArray<string> = [];

	sanitize() {
		if (this.disabledModules.includes('community-packages')) {
			this.enabled = false;
		}
	}
}
