/**
 * Re-export shared types from @MNI/workflow-sdk.
 */
import type { WorkflowTechniqueType } from '@MNI/workflow-sdk/prompts/best-practices';

export {
	WorkflowTechnique,
	TechniqueDescription,
	type WorkflowTechniqueType,
} from '@MNI/workflow-sdk/prompts/best-practices';

/**
 * Result of prompt categorization (framework-specific, stays local).
 */
export interface PromptCategorization {
	techniques: WorkflowTechniqueType[];
	confidence?: number;
}
