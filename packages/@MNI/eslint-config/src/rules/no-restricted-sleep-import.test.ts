import { RuleTester } from '@typescript-eslint/rule-tester';
import { NoRestrictedSleepImportRule } from './no-restricted-sleep-import.js';

const ruleTester = new RuleTester();

ruleTester.run('no-restricted-sleep-import', NoRestrictedSleepImportRule, {
	valid: [
		{ code: 'import { sleep } from "@MNI/utils/sleep"' },
		{ code: 'import { sleep } from "zx"' },
		{ code: 'import { sleep } from "./sleep"' },
		{ code: 'import { jsonParse } from "MNI-workflow"' },
		// Namespace imports say nothing about what they use — the generated
		// `vi.importActual` shape relies on this.
		{ code: 'import type * as _importType0 from "MNI-workflow"' },
		{ code: 'import * as n8nWorkflow from "MNI-workflow"' },
	],

	invalid: [
		{
			code: 'import { sleep } from "MNI-workflow"',
			errors: [{ messageId: 'noRestrictedSleepImport' }],
		},
		{
			code: 'import { sleep as delay } from "MNI-workflow"',
			errors: [{ messageId: 'noRestrictedSleepImport' }],
		},
		{
			code: 'import { jsonParse, sleep } from "MNI-workflow"',
			errors: [{ messageId: 'noRestrictedSleepImport' }],
		},
	],
});
