import { Config, Env } from '../decorators';

@Config
export class TemplatesConfig {
	/** Whether to enable loading and showing workflow templates. */
	@Env('MNI_TEMPLATES_ENABLED')
	enabled: boolean = true;

	/** Base URL for the workflow templates API. */
	@Env('MNI_TEMPLATES_HOST')
	host: string = 'https://api.n8n.io/api/';
}
