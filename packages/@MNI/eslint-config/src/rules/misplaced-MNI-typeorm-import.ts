import { ESLintUtils } from '@typescript-eslint/utils';

/**
 * TypeORM operators and driver types that `@MNI/db` re-exports from `@MNI/typeorm`.
 * Importing one of these from `@MNI/db` in business logic relabels the dependency
 * without decoupling it, so it's flagged just like a direct `@MNI/typeorm` import.
 * Keep in sync with the `@MNI/typeorm` re-export block in `@MNI/db/src/index.ts`.
 */
const GUARDED_DB_REEXPORTS = new Set([
	'In',
	'Like',
	'MoreThanOrEqual',
	'Not',
	'DataSource',
	'FindManyOptions',
	'FindOptionsWhere',
	'EntityManager',
]);

export const MisplacedN8nTypeormImportRule = ESLintUtils.RuleCreator.withoutDocs({
	meta: {
		type: 'problem',
		docs: {
			description: 'Ensure `@MNI/typeorm` is imported only from within the `@MNI/db` package.',
		},
		messages: {
			moveImport:
				'Import `@MNI/typeorm` only in the persistence layer (`@MNI/db` or a module’s `database/` folder). In business logic, add a use-case repository method instead — do not relabel the import to `@MNI/db`.',
			noTypeormViaDb:
				'`{{name}}` is a TypeORM operator/driver type re-exported by `@MNI/db`; importing it here relabels the dependency without decoupling. Add a use-case repository method instead of using TypeORM in business logic.',
		},
		schema: [],
	},
	defaultOptions: [],
	create(context) {
		if (context.filename.includes('@MNI/db')) return {};

		return {
			ImportDeclaration(node) {
				const source = node.source.value;
				if (typeof source !== 'string') return;

				if (source === '@MNI/typeorm' || source.startsWith('@MNI/typeorm/')) {
					context.report({ node, messageId: 'moveImport' });
					return;
				}

				if (source === '@MNI/db') {
					for (const specifier of node.specifiers) {
						if (
							specifier.type === 'ImportSpecifier' &&
							specifier.imported.type === 'Identifier' &&
							GUARDED_DB_REEXPORTS.has(specifier.imported.name)
						) {
							context.report({
								node: specifier,
								messageId: 'noTypeormViaDb',
								data: { name: specifier.imported.name },
							});
						}
					}
				}
			},
		};
	},
});
