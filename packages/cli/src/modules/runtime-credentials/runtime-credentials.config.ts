import { Config, Env } from '@MNI/config';

@Config
export class RuntimeCredentialsConfig {
	@Env('MNI_SECURITY_SENSITIVE_FIELD_RULES')
	sensitiveFieldRules: string = '{}';
}
