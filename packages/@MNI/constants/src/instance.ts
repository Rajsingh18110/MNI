export const INSTANCE_ID_HEADER = 'MNI-instance-id';
export const INSTANCE_VERSION_HEADER = 'MNI-version';

export const INSTANCE_TYPES = ['main', 'webhook', 'worker', 'engine'] as const;
export type InstanceType = (typeof INSTANCE_TYPES)[number];

export const INSTANCE_ROLES = ['unset', 'leader', 'follower'] as const;
export type InstanceRole = (typeof INSTANCE_ROLES)[number];
