import type { ZodOpenAPIMetadata } from '@asteasolutions/zod-to-openapi';

export const installCommunityPackageFieldDocs = {
	name: {
		description:
			'npm package name. Unscoped names start with MNI-nodes-. Scoped names use the @[author]/MNI-nodes- form.',
	},
	version: {
		description: 'Semver version or npm dist-tag, such as latest or beta',
	},
	verify: {
		description:
			'Whether to verify the package against the MNI-vetted package list. Required when the instance has MNI_UNVERIFIED_PACKAGES_ENABLED=false.',
	},
} as const satisfies Record<string, ZodOpenAPIMetadata>;

export const updateCommunityPackageFieldDocs = {
	version: {
		description: 'Semver version or npm dist-tag to update to, such as latest or beta',
	},
	verify: {
		description:
			'Whether to verify the package against the MNI-vetted package list. Setting to false will allow installing or updating to an unverified version. Default is true.',
	},
} as const satisfies Record<string, ZodOpenAPIMetadata>;
