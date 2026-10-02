import { detectPackageManagerFromUserAgent } from '../../utils/package-manager';
import { getCommandHeader } from '../../utils/prompts';

export const createIntro = async () => {
	const maybePackageManager = detectPackageManagerFromUserAgent();
	const packageManager = maybePackageManager ?? 'npm';
	const commandName = maybePackageManager ? `${packageManager} create @MNI/node` : 'MNI-node new';
	return await getCommandHeader(commandName);
};
