import { Expression } from '../src/expression';

// Only runs when MNI_EXPRESSION_ENGINE is set to 'vm' or 'quickjs'.
// Initializes the expression evaluator once per vitest worker before all tests,
// and disposes it after.
const engine = process.env.MNI_EXPRESSION_ENGINE as 'vm' | 'quickjs' | undefined;
if (engine === 'vm' || engine === 'quickjs') {
	beforeAll(async () => {
		await Expression.initExpressionEngine({
			engine,
			poolSize: 1,
			maxCodeCacheSize: 1024,
			bridgeTimeout: 5000,
			bridgeMemoryLimit: 128,
		});
		// Guard the dual-engine matrix: if init silently fell back, every suite in
		// this project would pass against the wrong engine.
		if (Expression.getActiveImplementation() !== engine) {
			throw new Error(
				`Expected active expression engine '${engine}', got '${Expression.getActiveImplementation()}'`,
			);
		}
	});

	afterAll(async () => {
		await Expression.disposeExpressionEngine();
	});
}
