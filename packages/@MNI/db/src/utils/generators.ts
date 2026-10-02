import type { InstanceType } from '@MNI/constants';
import { generateNanoId } from '@MNI/utils/generate-nano-id';

export function generateHostInstanceId(instanceType: InstanceType) {
	return `${instanceType}-${generateNanoId()}`;
}
