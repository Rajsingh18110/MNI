import { Config, Env } from '../decorators';

@Config
export class DeploymentConfig {
	/** Deployment type identifier (for example, `default`, `cloud`). Used for telemetry and feature behavior. */
	@Env('MNI_DEPLOYMENT_TYPE')
	type: string = 'default';
}
