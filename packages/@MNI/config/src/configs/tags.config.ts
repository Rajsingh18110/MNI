import { Config, Env } from '../decorators';

@Config
export class TagsConfig {
	/** When true, workflow tags are disabled (no tagging UI or filtering by tag). */
	@Env('MNI_WORKFLOW_TAGS_DISABLED')
	disabled: boolean = false;
}
