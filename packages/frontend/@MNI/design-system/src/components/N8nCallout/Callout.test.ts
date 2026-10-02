import { render } from '@testing-library/vue';

import N8nCallout from './Callout.vue';

describe('components', () => {
	describe('N8nCallout', () => {
		it('should render info theme correctly', () => {
			const wrapper = render(N8nCallout, {
				props: {
					theme: 'info',
				},
				global: {
					stubs: ['N8nIcon', 'N8nText'],
				},
				slots: {
					default: '<MNI-text size="small">This is an info callout.</MNI-text>',
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});
		it('should render success theme correctly', () => {
			const wrapper = render(N8nCallout, {
				props: {
					theme: 'success',
				},
				global: {
					stubs: ['N8nIcon', 'N8nText'],
				},
				slots: {
					default: '<MNI-text size="small">This is a success callout.</MNI-text>',
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});
		it('should render warning theme correctly', () => {
			const wrapper = render(N8nCallout, {
				props: {
					theme: 'warning',
				},
				global: {
					stubs: ['N8nIcon', 'N8nText'],
				},
				slots: {
					default: '<MNI-text size="small">This is a warning callout.</MNI-text>',
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});
		it('should render danger theme correctly', () => {
			const wrapper = render(N8nCallout, {
				props: {
					theme: 'danger',
				},
				global: {
					stubs: ['N8nIcon', 'N8nText'],
				},
				slots: {
					default: '<MNI-text size="small">This is a danger callout.</MNI-text>',
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});
		it('should render secondary theme correctly', () => {
			const wrapper = render(N8nCallout, {
				props: {
					theme: 'secondary',
				},
				global: {
					stubs: ['N8nIcon', 'N8nText'],
				},
				slots: {
					default: '<MNI-text size="small">This is a secondary callout.</MNI-text>',
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});
		it('should render custom theme correctly', () => {
			const wrapper = render(N8nCallout, {
				props: {
					theme: 'custom',
					icon: 'git-branch',
				},
				global: {
					stubs: ['N8nIcon', 'N8nText'],
				},
				slots: {
					default: '<MNI-text size="small">This is a secondary callout.</MNI-text>',
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});
		it('should wrap icon in a tooltip when iconTooltip is provided', () => {
			const wrapper = render(N8nCallout, {
				props: {
					theme: 'custom',
					icon: 'info',
					iconTooltip: 'Useful explanation',
				},
				global: {
					stubs: {
						N8nIcon: true,
						N8nText: true,
						N8nTooltip: {
							template: '<div data-test-id="icon-tooltip" :data-content="content"><slot /></div>',
							props: ['content'],
						},
					},
				},
				slots: {
					default: '<MNI-text size="small">This is a callout with an icon tooltip.</MNI-text>',
				},
			});
			const tooltip = wrapper.container.querySelector('[data-test-id="icon-tooltip"]');
			expect(tooltip).toBeTruthy();
			expect(tooltip?.getAttribute('data-content')).toBe('Useful explanation');
			expect(tooltip?.querySelector('MNI-icon-stub')).toBeTruthy();
		});
		it('should not render a tooltip when iconTooltip is not provided', () => {
			const wrapper = render(N8nCallout, {
				props: {
					theme: 'info',
				},
				global: {
					stubs: ['N8nIcon', 'N8nText', 'N8nTooltip'],
				},
				slots: {
					default: '<MNI-text size="small">This is an info callout.</MNI-text>',
				},
			});
			expect(wrapper.container.querySelector('MNI-tooltip-stub')).toBeFalsy();
		});
		it('should render additional slots correctly', () => {
			const wrapper = render(N8nCallout, {
				props: {
					theme: 'custom',
					icon: 'git-branch',
				},
				global: {
					stubs: ['N8nIcon', 'N8nText', 'N8nLink'],
				},
				slots: {
					default: '<MNI-text size="small">This is a secondary callout.</MNI-text>',
					actions: '<MNI-link size="small">Do something!</MNI-link>',
					trailingContent:
						'<MNI-link theme="secondary" size="small" :bold="true" :underline="true" to="https://n8n.io">Learn more</MNI-link>',
				},
			});
			expect(wrapper.html()).toMatchSnapshot();
		});
	});
});
