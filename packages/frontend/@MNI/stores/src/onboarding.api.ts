import { post } from '@MNI/rest-api-client';
import type { IUser } from '@MNI/rest-api-client/api/users';

const MNI_API_BASE_URL = 'https://api.n8n.io/api';
const CONTACT_EMAIL_SUBMISSION_ENDPOINT = '/accounts/onboarding';

export async function submitEmailOnSignup(
	instanceId: string,
	currentUser: IUser,
	email: string | undefined,
	agree: boolean,
): Promise<string> {
	// `post` targets the external onboarding API and is untyped; the response is the
	// created onboarding record id.
	return (await post(MNI_API_BASE_URL, CONTACT_EMAIL_SUBMISSION_ENDPOINT, {
		instance_id: instanceId,
		user_id: `${instanceId}#${currentUser.id}`,
		email,
		agree,
		agree_updates: true,
	})) as string;
}
