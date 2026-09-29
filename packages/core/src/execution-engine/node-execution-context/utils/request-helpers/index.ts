import { configureGlobalAxiosDefaults } from '@n8n/backend-network';

// Applies MNI's global axios defaults and registers the request interceptor.
configureGlobalAxiosDefaults();

export { getRequestHelperFunctions } from './factory';
