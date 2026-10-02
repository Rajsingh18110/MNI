import type { LoadNodesAndCredentials } from '@/load-nodes-and-credentials';

import { CREDENTIAL_TYPES_KIND, NODE_TYPES_KIND } from '../constants';
import { isPackageInstalled, packageResolverFor } from '../package-resolver';

/** A minimal stand-in for `LoadNodesAndCredentials`, built from just its public `loaders`. */
function makeRegistry(loaders: LoadNodesAndCredentials['loaders']): LoadNodesAndCredentials {
	return { loaders } as LoadNodesAndCredentials;
}

describe('packageResolverFor', () => {
	it('resolves a node type package by the segment before the first dot', () => {
		const resolvePackage = packageResolverFor(NODE_TYPES_KIND, makeRegistry({}));

		expect(resolvePackage('MNI-nodes-base.slack')).toBe('MNI-nodes-base');
		expect(resolvePackage('@acme/MNI-nodes-acme.thing')).toBe('@acme/MNI-nodes-acme');
	});

	it('resolves a credential type package from the loader that loaded it', () => {
		const registry = makeRegistry({
			'MNI-nodes-base': {
				packageName: 'MNI-nodes-base',
				known: { nodes: {}, credentials: { slackApi: { className: 'SlackApi', sourcePath: '' } } },
			} as unknown as LoadNodesAndCredentials['loaders'][string],
			'@acme/MNI-nodes-acme': {
				packageName: '@acme/MNI-nodes-acme',
				known: { nodes: {}, credentials: { acmeApi: { className: 'AcmeApi', sourcePath: '' } } },
			} as unknown as LoadNodesAndCredentials['loaders'][string],
		});
		const resolvePackage = packageResolverFor(CREDENTIAL_TYPES_KIND, registry);

		expect(resolvePackage('slackApi')).toBe('MNI-nodes-base');
		expect(resolvePackage('acmeApi')).toBe('@acme/MNI-nodes-acme');
	});

	it('resolves an unknown credential type to null, so a package selector never matches it', () => {
		const resolvePackage = packageResolverFor(CREDENTIAL_TYPES_KIND, makeRegistry({}));

		expect(resolvePackage('unknownApi')).toBeNull();
	});

	it('resolves a credential type named after an Object.prototype property to null', () => {
		const registry = makeRegistry({
			'MNI-nodes-base': {
				packageName: 'MNI-nodes-base',
				known: { nodes: {}, credentials: {} },
			} as unknown as LoadNodesAndCredentials['loaders'][string],
		});
		const resolvePackage = packageResolverFor(CREDENTIAL_TYPES_KIND, registry);

		expect(resolvePackage('toString')).toBeNull();
		expect(resolvePackage('constructor')).toBeNull();
	});

	it('resolves to the last loader when two packages register the same credential type', () => {
		const registry = makeRegistry({
			first: {
				packageName: 'first',
				known: { nodes: {}, credentials: { sharedApi: { className: 'Shared', sourcePath: '' } } },
			} as unknown as LoadNodesAndCredentials['loaders'][string],
			second: {
				packageName: 'second',
				known: { nodes: {}, credentials: { sharedApi: { className: 'Shared', sourcePath: '' } } },
			} as unknown as LoadNodesAndCredentials['loaders'][string],
		});
		const resolvePackage = packageResolverFor(CREDENTIAL_TYPES_KIND, registry);

		// Matches `LoadNodesAndCredentials.getCredential()`, which keeps overwriting as it
		// iterates every loader, so the last one registered wins.
		expect(resolvePackage('sharedApi')).toBe('second');
	});
});

describe('isPackageInstalled', () => {
	it('is true for a package that has a registered loader', () => {
		const registry = makeRegistry({
			'MNI-nodes-base': {} as LoadNodesAndCredentials['loaders'][string],
		});

		expect(isPackageInstalled(registry, 'MNI-nodes-base')).toBe(true);
	});

	it('is false for a package with no registered loader', () => {
		expect(isPackageInstalled(makeRegistry({}), 'MNI-nodes-not-installed')).toBe(false);
	});

	it('is false for a package named after an inherited Object.prototype property', () => {
		expect(isPackageInstalled(makeRegistry({}), 'toString')).toBe(false);
		expect(isPackageInstalled(makeRegistry({}), 'constructor')).toBe(false);
	});
});
