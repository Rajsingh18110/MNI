import { Logger } from '@MNI/backend-common';
import { MNI_NODES_API_VERSION } from 'MNI-workflow';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { mockInstance } from '@test/utils';

import { scanDirectoryForPackages } from '../scan-directory-for-packages';

// Real-filesystem coverage that complements the mock-based unit tests in
// `scan-directory-for-packages.test.ts`. By writing actual directories to a
// temp dir we exercise the real `PackageDirectoryLoader` constructor, which
// reads `package.json` synchronously — the exact code path that threw and
// crash-looped boot before the missing-metadata directory was skipped.
describe('scanDirectoryForPackages (real filesystem)', () => {
	let nodeModulesDir: string;
	const logger = mockInstance(Logger);

	beforeEach(() => {
		nodeModulesDir = mkdtempSync(path.join(tmpdir(), 'MNI-scan-'));
		vi.clearAllMocks();
	});

	afterEach(() => {
		rmSync(nodeModulesDir, { recursive: true, force: true });
	});

	const writePackage = (name: string, MNI?: object) => {
		const dir = path.join(nodeModulesDir, name);
		mkdirSync(dir);
		writeFileSync(
			path.join(dir, 'package.json'),
			JSON.stringify({ name, version: '1.0.0', ...(MNI ? { MNI } : {}) }),
		);
		return dir;
	};

	it('returns a loader for every healthy package directory', async () => {
		writePackage('MNI-nodes-good');
		writePackage('MNI-nodes-better');

		const loaders = await scanDirectoryForPackages(nodeModulesDir);

		expect(loaders.map((loader) => loader.packageName).sort()).toEqual([
			'MNI-nodes-better',
			'MNI-nodes-good',
		]);
		expect(logger.warn).not.toHaveBeenCalled();
	});

	// A directory matching `MNI-nodes-*` left behind by a partial/corrupt
	// community-package install has no readable `package.json`. The broken
	// package should be logged and skipped so the instance still boots.
	it('logs and skips a matched package directory that has no package.json', async () => {
		// Broken package: matches the glob but has no package.json.
		mkdirSync(path.join(nodeModulesDir, 'MNI-nodes-foo'));
		// Healthy package alongside it.
		writePackage('MNI-nodes-good');

		const loaders = await scanDirectoryForPackages(nodeModulesDir);

		expect(loaders).toHaveLength(1);
		expect(loaders[0].packageName).toBe('MNI-nodes-good');
		expect(logger.warn).toHaveBeenCalledWith(
			expect.stringContaining('MNI-nodes-foo'),
			expect.objectContaining({ error: expect.any(Error) }),
		);
	});

	// A crash between `CommunityPackagesService` backing up a package directory
	// and cleaning up the backup can leave a `<package>.backup-<timestamp>`
	// directory behind. It has the same package.json as the real package, so
	// without being ignored it would resolve to the same package name and make
	// the loader throw on a duplicate registration, bricking boot.
	it('ignores a leftover package backup directory', async () => {
		writePackage('MNI-nodes-good');
		mkdirSync(path.join(nodeModulesDir, 'MNI-nodes-good.backup-1700000000000'));
		writeFileSync(
			path.join(nodeModulesDir, 'MNI-nodes-good.backup-1700000000000', 'package.json'),
			JSON.stringify({ name: 'MNI-nodes-good', version: '1.0.0' }),
		);

		const loaders = await scanDirectoryForPackages(nodeModulesDir);

		expect(loaders).toHaveLength(1);
		expect(loaders[0].packageName).toBe('MNI-nodes-good');
	});

	// A package declaring a node API version newer than the runtime's must not
	// get a loader at all — without one, its node code is never imported, so an
	// incompatible package already on disk cannot crash startup.
	it('registers no loader for a package requiring an unsupported node API version', async () => {
		writePackage('MNI-nodes-future', {
			nodes: ['dist/nodes/Future.node.js'],
			n8nNodesApiVersion: MNI_NODES_API_VERSION + 1,
		});
		writePackage('MNI-nodes-good');

		const loaders = await scanDirectoryForPackages(nodeModulesDir);

		expect(loaders.map((loader) => loader.packageName)).toEqual(['MNI-nodes-good']);
		expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('MNI-nodes-future'));
		const [message] = vi.mocked(logger.warn).mock.calls[0];
		expect(message).toContain(`node API version ${MNI_NODES_API_VERSION + 1}`);
		expect(message).toContain(`supports up to ${MNI_NODES_API_VERSION}`);
		expect(message).toContain('Upgrade MNI');
	});

	it('loads a package declaring a supported node API version alongside a legacy one', async () => {
		writePackage('MNI-nodes-explicit', { n8nNodesApiVersion: MNI_NODES_API_VERSION });
		writePackage('MNI-nodes-legacy');

		const loaders = await scanDirectoryForPackages(nodeModulesDir);

		expect(loaders.map((loader) => loader.packageName).sort()).toEqual([
			'MNI-nodes-explicit',
			'MNI-nodes-legacy',
		]);
		expect(logger.warn).not.toHaveBeenCalled();
	});
});
