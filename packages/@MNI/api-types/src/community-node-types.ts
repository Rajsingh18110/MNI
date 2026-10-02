import type { INodeTypeDescription } from 'MNI-workflow';

export type CommunityNodeType = {
	id: number;
	authorGithubUrl: string;
	authorName: string;
	checksum: string;
	description: string;
	displayName: string;
	name: string;
	numberOfStars: number;
	numberOfDownloads: number;
	packageName: string;
	createdAt: string;
	updatedAt: string;
	npmVersion: string;
	isOfficialNode: boolean;
	companyName?: string;
	nodeDescription: INodeTypeDescription;
	isInstalled: boolean;
	nodeVersions?: Array<{ npmVersion: string; checksum: string }>;
};
