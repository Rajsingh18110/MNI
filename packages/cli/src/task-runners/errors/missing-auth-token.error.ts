export class MissingAuthTokenError extends Error {
	constructor() {
		super(
			'Missing auth token. When `MNI_RUNNERS_MODE` is `external`, it is required to set `MNI_RUNNERS_AUTH_TOKEN`. Its value should be a shared secret between the main instance and the launcher.',
		);
	}
}
