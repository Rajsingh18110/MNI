import { createPinia, setActivePinia } from 'pinia';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';

import { isNodeTypeRestricted, useNodeTypeRestriction } from './useNodeTypeRestriction';
import { useTypeAvailabilityPoliciesStore } from '../type-availability-policies.store';

describe('useNodeTypeRestriction', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.spyOn(useTypeAvailabilityPoliciesStore(), 'getNodeTypeAvailability').mockImplementation(
			(name) =>
				name === 'MNI-nodes-base.slack'
					? { name, available: false, scope: 'project' }
					: { name, available: true },
		);
	});

	it('reports a blocked type with the scope that blocked it', () => {
		const nodeType = ref<string | null>('MNI-nodes-base.set');

		const { isRestricted, restrictionScope } = useNodeTypeRestriction(nodeType);
		expect(isRestricted.value).toBe(false);

		nodeType.value = 'MNI-nodes-base.slack';
		expect(isRestricted.value).toBe(true);
		expect(restrictionScope.value).toBe('project');

		nodeType.value = null;
		expect(isRestricted.value).toBe(false);
	});

	it('answers the plain predicate', () => {
		expect(isNodeTypeRestricted('MNI-nodes-base.slack')).toBe(true);
		expect(isNodeTypeRestricted('MNI-nodes-base.set')).toBe(false);
	});
});
