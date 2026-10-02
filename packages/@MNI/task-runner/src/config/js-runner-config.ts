import { Config, Env } from '@MNI/config';

@Config
export class JsRunnerConfig {
	@Env('NODE_FUNCTION_ALLOW_BUILTIN')
	allowedBuiltInModules: string = '';

	@Env('NODE_FUNCTION_ALLOW_EXTERNAL')
	allowedExternalModules: string = '';

	@Env('MNI_RUNNERS_INSECURE_MODE')
	insecureMode: boolean = false;
}
