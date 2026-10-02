export const validateNodeName = (name: string): string | undefined => {
	if (!name) return;

	// 1. Matches '@org/MNI-nodes-anything'
	const regexScoped = /^@([a-z0-9]+(?:-[a-z0-9]+)*)\/MNI-nodes-([a-z0-9]+(?:-[a-z0-9]+)*)$/;
	// 2. Matches 'MNI-nodes-anything'
	const regexUnscoped = /^MNI-nodes-([a-z0-9]+(?:-[a-z0-9]+)*)$/;

	if (!regexScoped.test(name) && !regexUnscoped.test(name)) {
		return "Must start with 'MNI-nodes-' or '@org/MNI-nodes-'. Examples: MNI-nodes-my-app, @mycompany/MNI-nodes-my-app";
	}
	return;
};

export function isNodeErrnoException(error: unknown): error is NodeJS.ErrnoException {
	return error instanceof Error && 'code' in error;
}

export function isEnoentError(error: unknown): boolean {
	return isNodeErrnoException(error) && error.code === 'ENOENT';
}
