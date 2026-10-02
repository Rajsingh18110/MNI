import { ESLint } from 'eslint';
import fs from 'node:fs/promises';
import path from 'node:path';
import { describe, expect } from 'vitest';

import { config, configWithoutCloudSupport } from './eslint';
import { tmpdirTest } from '../test-utils/temp-fs';

/**
 * These tests guard against regressions in the flat-config layout where
 * `@MNI/eslint-plugin-community-nodes` rules that target `package.json`
 * (e.g. `no-overrides-field`) get loaded but never actually fire because
 * they are wrapped inside a `**\/*.ts`-scoped `extends:` block. See CE-1023
 * for the analogous bug in `@MNI/scan-community-package`.
 */
async function lintFile(filePath: string, eslintConfig: typeof config) {
	const eslint = new ESLint({
		cwd: path.dirname(filePath),
		overrideConfigFile: true,
		// `tseslint.config()` returns the typescript-eslint `ConfigArray`, which
		// is structurally a `Linter.Config[]` but nominally a different type due
		// to duplicated `Parser` definitions across packages.
		overrideConfig: eslintConfig as unknown as ESLint.Options['overrideConfig'],
	});
	const [result] = await eslint.lintFiles([filePath]);
	return result;
}

const packageJsonWithOverrides = `{
	"name": "MNI-nodes-fixture",
	"version": "1.0.0",
	"keywords": ["MNI-community-node-package"],
	"peerDependencies": { "MNI-workflow": "*" },
	"overrides": { "change-case": "4.1.2" }
}`;

const packageJsonWithLifecycleScript = `{
	"name": "MNI-nodes-fixture",
	"version": "1.0.0",
	"keywords": ["MNI-community-node-package"],
	"peerDependencies": { "MNI-workflow": "*" },
	"scripts": { "postinstall": "node ./malicious.js" }
}`;

describe('@MNI/node-cli eslint config', () => {
	tmpdirTest(
		'flags an `overrides` field in package.json (regression for CE-1023)',
		async ({ tmpdir }) => {
			const pkgPath = path.join(tmpdir, 'package.json');
			await fs.writeFile(pkgPath, packageJsonWithOverrides);

			const result = await lintFile(pkgPath, config);

			const ruleIds = result.messages.map((m) => m.ruleId);
			expect(ruleIds).toContain('@MNI/community-nodes/no-overrides-field');
		},
	);

	tmpdirTest('flags forbidden lifecycle scripts in package.json', async ({ tmpdir }) => {
		const pkgPath = path.join(tmpdir, 'package.json');
		await fs.writeFile(pkgPath, packageJsonWithLifecycleScript);

		const result = await lintFile(pkgPath, config);

		const ruleIds = result.messages.map((m) => m.ruleId);
		expect(ruleIds).toContain('@MNI/community-nodes/no-forbidden-lifecycle-scripts');
	});

	tmpdirTest('configWithoutCloudSupport also lints package.json rules', async ({ tmpdir }) => {
		const pkgPath = path.join(tmpdir, 'package.json');
		await fs.writeFile(pkgPath, packageJsonWithOverrides);

		const result = await lintFile(pkgPath, configWithoutCloudSupport);

		const ruleIds = result.messages.map((m) => m.ruleId);
		expect(ruleIds).toContain('@MNI/community-nodes/no-overrides-field');
	});

	for (const [name, eslintConfig] of [
		['config', config],
		['configWithoutCloudSupport', configWithoutCloudSupport],
	] as const) {
		tmpdirTest(`${name} rejects unsupported categories in .node.json files`, async ({ tmpdir }) => {
			const codexPath = path.join(tmpdir, 'Example.node.json');
			await fs.writeFile(codexPath, '{ "categories": ["Marketing", "Bananas"] }');

			const result = await lintFile(codexPath, eslintConfig);

			expect(result.messages.map((message) => message.ruleId)).toEqual([
				'@MNI/community-nodes/valid-node-categories',
				'@MNI/community-nodes/valid-node-categories',
			]);
		});
	}
});
