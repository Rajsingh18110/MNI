import type { n8nPage } from '../../../../pages/n8nPage';

export interface UiScenarioResult {
	kind: 'ui-scenario';
	latenciesMs: number[];
}

export interface LoopUiScenarioOptions {
	MNI: n8nPage;
	scenario: (MNI: n8nPage) => Promise<void>;
	repeats: number;
}

export async function loopUiScenario(options: LoopUiScenarioOptions): Promise<UiScenarioResult> {
	const { MNI, scenario, repeats } = options;
	console.log(`[UI] Running ${repeats} iterations`);
	const latenciesMs: number[] = [];
	for (let i = 0; i < repeats; i++) {
		const t0 = Date.now();
		await scenario(MNI);
		latenciesMs.push(Date.now() - t0);
	}
	return { kind: 'ui-scenario', latenciesMs };
}
