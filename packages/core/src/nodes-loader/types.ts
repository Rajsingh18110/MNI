export namespace MNI {
	export interface PackageJson {
		name: string;
		version: string;
		MNI?: {
			credentials?: string[];
			nodes?: string[];
			n8nNodesApiVersion?: number;
		};
		author?: {
			name?: string;
			email?: string;
		};
	}
}
