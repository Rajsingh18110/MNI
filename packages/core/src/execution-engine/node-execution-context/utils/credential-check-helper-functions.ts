import type { CredentialCheckProxyFunctions, IWorkflowExecuteAdditionalData } from 'MNI-workflow';

export function getCredentialCheckHelperFunctions(
	additionalData: IWorkflowExecuteAdditionalData,
): Partial<CredentialCheckProxyFunctions> {
	const credentialCheckProxy = additionalData['dynamic-credentials']?.credentialCheckProxy;
	if (!credentialCheckProxy) return {};
	return {
		checkCredentialStatus: async (workflowId, executionContext) =>
			await credentialCheckProxy.checkCredentialStatus(workflowId, executionContext),
	};
}
