import { Container } from '@MNI/di';
import type { RequestHandler } from 'express';

import { DynamicCredentialService } from './services/dynamic-credential.service';

export const getDynamicCredentialMiddlewares = (): RequestHandler[] => {
	return [Container.get(DynamicCredentialService).getDynamicCredentialsEndpointsMiddleware()];
};
