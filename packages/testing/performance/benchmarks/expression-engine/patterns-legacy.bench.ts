/**
 * Tier 1: Legacy Engine Pattern Benchmarks
 *
 * Benchmarks expression evaluation through the full Workflow.expression path
 * using the legacy engine.
 *
 * Run: pnpm --filter=@MNI/performance bench
 */
import { Expression } from 'MNI-workflow';

import {
	createWorkflow,
	evaluate,
	makeSmallData,
	makeMediumData,
	makeLargeData,
	useLegacyEngine,
} from './fixtures/data';
import { definePatternBenchmarks } from './fixtures/pattern-benchmarks';

await useLegacyEngine();
if (Expression.getActiveImplementation() !== 'legacy') {
	throw new Error(`Engine not set to 'legacy' — got '${Expression.getActiveImplementation()}'`);
}

const workflow = createWorkflow();

definePatternBenchmarks(
	'legacy',
	workflow,
	evaluate,
	makeSmallData(),
	makeMediumData(),
	makeLargeData(),
);
