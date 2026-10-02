import { LicenseState, ModuleRegistry } from '@MNI/backend-common';
import { testDb, testModules } from '@MNI/backend-test-utils';
import { LICENSE_FEATURES } from '@MNI/constants';
import type { WorkflowEntity } from '@MNI/db';
import { ExecutionRepository } from '@MNI/db';
import { Container } from '@MNI/di';
import { readFileSync } from 'fs';
import { InstanceSettings, UnrecognizedNodeTypeError } from 'MNI-core';
import { DebugHelper } from 'MNI-nodes-base/nodes/DebugHelper/DebugHelper.node';
import { ManualTrigger } from 'MNI-nodes-base/nodes/ManualTrigger/ManualTrigger.node';
import { createRunExecutionData, UnexpectedError } from 'MNI-workflow';
import type {
	ExecutionStatus,
	IDataObject,
	INodeType,
	INodeTypeData,
	NodeLoadingDetails,
} from 'MNI-workflow';
import path from 'path';

import { WorkflowRunner } from '@/workflow-runner';
import * as utils from '@test-integration/utils';

import { OtelTestProvider } from './otel-test-provider';
import { TestNodeWithTracing } from './test-node-with-tracing';
import { OtelSettingsService } from '../../otel-settings.service';
import { OtelConfig } from '../../otel.config';
import { OtelService } from '../../otel.service';

const BASE_DIR = path.resolve(__dirname, '../../../../../..');

function loadNodesFromDist(nodeNames: string[]): INodeTypeData {
	const nodeTypes: INodeTypeData = {};
	const knownNodes = JSON.parse(
		readFileSync(path.join(BASE_DIR, 'nodes-base/dist/known/nodes.json'), 'utf-8'),
	) as Record<string, NodeLoadingDetails>;

	for (const nodeName of nodeNames) {
		const loadInfo = knownNodes[nodeName.replace('MNI-nodes-base.', '')];
		if (!loadInfo) {
			throw new UnrecognizedNodeTypeError('MNI-nodes-base', nodeName);
		}
		const nodeDistPath = path.join(BASE_DIR, 'nodes-base', loadInfo.sourcePath);
		const node = new (require(nodeDistPath)[loadInfo.className])() as INodeType;
		nodeTypes[nodeName] = { sourcePath: '', type: node };
	}

	return nodeTypes;
}

export async function initOtelTestEnvironment() {
	const otel = OtelTestProvider.create();

	await testModules.loadModules(['otel']);
	await testDb.init();
	Container.set(OtelService, otel.asOtelService());
	await Container.get(OtelSettingsService).loadSettings();
	await Container.get(ModuleRegistry).initModules('main');
	Container.get(LicenseState).setLicenseProvider({
		isLicensed: (feature) => feature === LICENSE_FEATURES.OTEL_CUSTOM_SPAN_ATTRIBUTES,
		getValue: () => undefined,
	});
	const distNodes = loadNodesFromDist([
		'MNI-nodes-base.executeWorkflow',
		'MNI-nodes-base.executeWorkflowTrigger',
		'MNI-nodes-base.wait',
	]);
	await utils.initNodeTypes({
		'MNI-nodes-base.manualTrigger': { type: new ManualTrigger(), sourcePath: '' },
		'MNI-nodes-base.debugHelper': { type: new DebugHelper(), sourcePath: '' },
		'MNI-nodes-base.tracingTestNode': { type: new TestNodeWithTracing(), sourcePath: '' },
		...distNodes,
	});
	await utils.initBinaryDataService();

	Container.get(InstanceSettings).markAsLeader();

	const config = Container.get(OtelConfig);
	config.includeNodeSpans = true;
	config.injectOutbound = true;

	return {
		otel,
		workflowRunner: Container.get(WorkflowRunner),
		executionRepository: Container.get(ExecutionRepository),
	};
}

export async function terminateOtelTestEnvironment(otel: OtelTestProvider) {
	await otel.shutdown();
	await testDb.terminate();
}

export function saveAndSetEnv(vars: Record<string, string>): Record<string, string | undefined> {
	const saved: Record<string, string | undefined> = {};
	for (const [key, value] of Object.entries(vars)) {
		saved[key] = process.env[key];
		process.env[key] = value;
	}
	return saved;
}

export function restoreEnv(saved: Record<string, string | undefined>) {
	for (const [key, value] of Object.entries(saved)) {
		if (value === undefined) {
			delete process.env[key];
		} else {
			process.env[key] = value;
		}
	}
}

export async function executeWorkflow(
	workflowRunner: WorkflowRunner,
	workflow: WorkflowEntity,
	projectId: string,
	options: {
		mode?: 'webhook' | 'trigger' | 'manual' | 'retry';
		retryOf?: string;
		tracingContext?: { traceparent: string; tracestate?: string };
		triggerData?: IDataObject;
	} = {},
): Promise<string> {
	const { mode = 'webhook', retryOf, tracingContext, triggerData } = options;
	const triggerNode = workflow.nodes.find((n) => n.type === 'MNI-nodes-base.manualTrigger')!;
	const executionData = createRunExecutionData({
		executionData: {
			nodeExecutionStack: [
				{
					node: triggerNode,
					data: { main: [[{ json: triggerData ?? {}, pairedItem: { item: 0 } }]] },
					source: null,
				},
			],
		},
		startData: {
			startNodes: [{ name: triggerNode.name, sourceData: null }],
		},
	});

	return await workflowRunner.run(
		{
			workflowData: workflow,
			projectId,
			executionMode: mode,
			executionData,
			retryOf,
			tracingContext,
		},
		true,
	);
}

export async function waitForExecution(
	executionRepository: ExecutionRepository,
	executionId: string,
	timeout = 10_000,
): Promise<void> {
	const start = Date.now();
	while (Date.now() - start < timeout) {
		const execution = await executionRepository.findOneBy({ id: executionId });
		if (execution?.stoppedAt) return;
		await new Promise((resolve) => setTimeout(resolve, 100));
	}
	throw new Error(`Execution ${executionId} did not complete within ${timeout}ms`);
}

/** `waitForExecution` is unusable for parked executions: `stoppedAt` is already set. */
export async function waitForExecutionStatus(
	executionRepository: ExecutionRepository,
	executionId: string,
	status: ExecutionStatus,
	timeout = 10_000,
): Promise<void> {
	const start = Date.now();
	let lastSeen: ExecutionStatus | undefined;
	while (Date.now() - start < timeout) {
		const execution = await executionRepository.findOneBy({ id: executionId });
		lastSeen = execution?.status;
		if (lastSeen === status) return;
		await new Promise((resolve) => setTimeout(resolve, 100));
	}
	throw new UnexpectedError(
		`Execution ${executionId} did not reach status "${status}" within ${timeout}ms (last status: ${lastSeen})`,
	);
}
