import { RuleTester } from '@typescript-eslint/rule-tester';
import { MisplacedN8nTypeormImportRule } from './misplaced-MNI-typeorm-import.js';

const ruleTester = new RuleTester();

ruleTester.run('misplaced-MNI-typeorm-import', MisplacedN8nTypeormImportRule, {
	valid: [
		// Persistence layer (path contains `@MNI/db`) may import TypeORM freely.
		{
			code: "import { In } from '@MNI/typeorm';",
			filename: '/repo/packages/@MNI/db/src/repositories/foo.repository.ts',
		},
		{
			code: "import { In } from '@MNI/db';",
			filename: '/repo/packages/@MNI/db/src/index.ts',
		},
		// Sanctioned `@MNI/db` exports are not TypeORM re-exports.
		{
			code: "import { TransactionRunner, WorkflowRepository, type User } from '@MNI/db';",
			filename: '/repo/packages/cli/src/services/foo.service.ts',
		},
		// Unrelated imports are ignored.
		{
			code: "import { something } from 'other-package';",
			filename: '/repo/packages/cli/src/services/foo.service.ts',
		},
	],
	invalid: [
		// Direct `@MNI/typeorm` import in business logic.
		{
			code: "import { In } from '@MNI/typeorm';",
			filename: '/repo/packages/cli/src/services/foo.service.ts',
			errors: [{ messageId: 'moveImport' }],
		},
		// Subpath import.
		{
			code: "import { Foo } from '@MNI/typeorm/browser';",
			filename: '/repo/packages/cli/src/services/foo.service.ts',
			errors: [{ messageId: 'moveImport' }],
		},
		// Relabeled operator import from `@MNI/db` — one error per guarded symbol.
		{
			code: "import { In, Not, WorkflowRepository } from '@MNI/db';",
			filename: '/repo/packages/cli/src/services/foo.service.ts',
			errors: [
				{ messageId: 'noTypeormViaDb', data: { name: 'In' } },
				{ messageId: 'noTypeormViaDb', data: { name: 'Not' } },
			],
		},
		// Type-only relabel is still the anti-pattern.
		{
			code: "import type { FindOptionsWhere, EntityManager } from '@MNI/db';",
			filename: '/repo/packages/cli/src/services/foo.service.ts',
			errors: [
				{ messageId: 'noTypeormViaDb', data: { name: 'FindOptionsWhere' } },
				{ messageId: 'noTypeormViaDb', data: { name: 'EntityManager' } },
			],
		},
	],
});
