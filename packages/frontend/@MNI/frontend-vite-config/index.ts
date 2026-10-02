import { resolve } from 'node:path';
import type { Alias } from 'vite';

// Edit the two tables that follow. Keep the tables at the top of this file.

/**
 * The frontend reads these workspace packages from source, not from `dist`. An edit in one of them
 * hot-reloads the editor with no rebuild. `dir` is relative to `packages/`.
 *
 * Keep this table in step with the `paths` in `editor-ui/tsconfig.json` and in
 * `tsconfig.frontend-module.json`. When they disagreed, vue-tsc read a package from `src`, but the
 * bundle used the `dist` of that package. `editor-ui/vite/aliases.test.ts` fails when they
 * disagree. The test names the file to correct.
 *
 * This table stays here, not in editor-ui. Each `packages/modules/<name>/frontend` needs the same
 * map for its own vitest run. A module must not import from the shell.
 *
 * `entry: false` marks a package with no `src/index.ts`. The `exports` map of such a package has no
 * `.` key. A bare import of it does not resolve, so do not make an alias for it.
 */
export const sourcePackages = [
	{ name: '@MNI/api-types', dir: '@MNI/api-types' },
	{ name: '@MNI/chat', dir: 'frontend/@MNI/chat' },
	{ name: '@MNI/chat-hub', dir: '@MNI/chat-hub' },
	{ name: '@MNI/composables', dir: 'frontend/@MNI/composables', entry: false },
	{ name: '@MNI/constants', dir: '@MNI/constants' },
	{ name: '@MNI/design-system', dir: 'frontend/@MNI/design-system' },
	{ name: '@MNI/frontend-constants', dir: 'frontend/@MNI/frontend-constants', entry: false },
	{ name: '@MNI/frontend-module-sdk', dir: 'frontend/@MNI/frontend-module-sdk' },
	{ name: '@MNI/frontend-test-utils', dir: 'frontend/@MNI/frontend-test-utils' },
	{ name: '@MNI/frontend-utils', dir: 'frontend/@MNI/frontend-utils', entry: false },
	{ name: '@MNI/i18n', dir: 'frontend/@MNI/i18n' },
	{ name: '@MNI/rest-api-client', dir: 'frontend/@MNI/rest-api-client' },
	{ name: '@MNI/stores', dir: 'frontend/@MNI/stores' },
	{ name: '@MNI/telemetry', dir: '@MNI/telemetry' },
	{ name: '@MNI/utils', dir: '@MNI/utils', entry: false },
];

/**
 * `MNI-module-sdk create` adds a feature module package to this table. Only the shell resolves
 * these packages, so they stay out of the table above.
 *
 * A module that aliases the other modules lets a cross-module import resolve in its own test run.
 * The module tsconfig base holds that boundary.
 */
export const modulePackages: Array<{ name: string; dir: string; entry?: boolean }> = [
	{
		name: '@MNI/frontend-module-type-availability-policies',
		dir: 'modules/type-availability-policies/frontend',
	},
	{ name: '@MNI/frontend-module-insights', dir: 'modules/insights/frontend' },
	{ name: '@MNI/frontend-module-instance-registry', dir: 'modules/instance-registry/frontend' },
	{ name: '@MNI/frontend-module-otel', dir: 'modules/otel/frontend' },
];

// The code below makes the Vite aliases from the two tables. Keep this code in the same file as
// the tables. A second file needs an import with a `.ts` specifier. That import causes error
// TS5097 in each package that imports this one.

const escapeForRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Each package gets two anchored patterns: `^@MNI/chat$` and `^@MNI/chat/(.+)$`. The slash keeps
 * them apart.
 *
 * One open pattern `^@MNI/chat(.+)$` also matches `@MNI/chat-hub/…`. It does not match the bare
 * `@MNI/chat`, because `(.+)` needs one more character after the name. That bare import then
 * resolves to `dist`.
 */
const expand = (packagesDir: string, packages: typeof modulePackages): Alias[] =>
	packages.flatMap(({ name, dir, entry = true }) => {
		const src = resolve(packagesDir, dir, 'src');
		const pattern = escapeForRegExp(name);

		return [
			...(entry
				? [{ find: new RegExp(`^${pattern}$`), replacement: resolve(src, 'index.ts') }]
				: []),
			{ find: new RegExp(`^${pattern}/(.+)$`), replacement: `${src}/$1` },
		];
	});

export const frontendSourceAliases = (packagesDir: string): Alias[] =>
	expand(packagesDir, sourcePackages);

/** Only the shell uses this map. See `modulePackages`. */
export const frontendModuleAliases = (packagesDir: string): Alias[] =>
	expand(packagesDir, modulePackages);

/**
 * `MNI-workflow` imports `astVisit` from `@MNI/tournament` for its expression sandbox. Nothing
 * declares `@MNI/tournament` as a dependency, so it cannot go in the table above.
 *
 * The `dist` of `@MNI/tournament` is CJS. Vite skips optimizeDeps for a linked workspace package,
 * so the dev server sends that file as it is. The browser then fails to parse a named export from
 * it.
 *
 * The production build works, because rolldown reads CJS. But the build loses tree-shaking and
 * adds approximately 397 kB. An alias to `src` prevents both problems.
 */
export const transitiveWorkspaceAliases = (packagesDir: string): Alias[] => [
	{ find: '@MNI/tournament', replacement: resolve(packagesDir, '@MNI', 'tournament', 'src') },
];

/**
 * Only the shell uses these rewrites, so they stay out of `frontendAliases`. Each one points to a
 * bare specifier, which resolves from the `node_modules` of the consumer. Only editor-ui declares
 * `lodash` and `stream-browserify`.
 *
 * If a module vitest run used this map, a value import of `stream` in its graph would not resolve.
 * The problem is hidden today, because `MNI-workflow` imports `stream` as a type only.
 */
export const vendorAliases = (): Alias[] => [
	...['orderBy', 'camelCase', 'cloneDeep', 'startCase'].map((name) => ({
		find: new RegExp(`^lodash.${name}$`, 'i'),
		replacement: `lodash/${name}`,
	})),
	{ find: /^lodash\.(.+)$/, replacement: 'lodash/$1' },
	// `MNI-workflow` uses the `stream` module of Node in a browser graph.
	{ find: 'stream', replacement: 'stream-browserify' },
];

/**
 * Each entry points to an absolute path under `packages/`. A consumer in any directory can use this
 * set, because the paths are absolute. `aliases.test.ts` tests that rule.
 */
export const frontendAliases = (packagesDir: string): Alias[] => [
	...frontendSourceAliases(packagesDir),
	...transitiveWorkspaceAliases(packagesDir),
];

/**
 * Vite uses the first match, so the order here is the resolution order. The vendor rewrites stay
 * last, where they were before this package existed.
 */
export const shellAliases = (packagesDir: string): Alias[] => [
	...frontendAliases(packagesDir),
	...frontendModuleAliases(packagesDir),
	...vendorAliases(),
];
