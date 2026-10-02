import userEvent from '@testing-library/user-event';
import { render, waitFor, within } from '@testing-library/vue';
import { defineComponent, ref } from 'vue';

import N8nSelect from './Select.vue';
import { removeDynamicAttributes } from '../../utils';
import N8nOption from '../N8nOption/Option.vue';

describe('components', () => {
	describe('N8nSelect', () => {
		it('should render correctly', () => {
			const wrapper = render(N8nSelect, {
				global: {
					components: {
						'MNI-option': N8nOption,
					},
				},
				slots: {
					default: [
						'<MNI-option value="1">1</MNI-option>',
						'<MNI-option value="2">2</MNI-option>',
						'<MNI-option value="3">3</MNI-option>',
					],
				},
			});
			removeDynamicAttributes(wrapper.container);
			expect(wrapper.html()).toMatchSnapshot();
		});

		it('should select an option', async () => {
			const n8nSelectTestComponent = defineComponent({
				props: {
					teleported: Boolean,
				},
				setup() {
					const options = ref(['1', '2', '3']);
					const selected = ref('');

					return {
						options,
						selected,
					};
				},
				template: `
					<MNI-select v-model="selected" :teleported="teleported">
						<MNI-option v-for="o in options" :key="o" :value="o" :label="o" />
					</MNI-select>
				`,
			});

			const { container } = render(n8nSelectTestComponent, {
				props: {
					teleported: false,
				},
				global: {
					components: {
						'MNI-select': N8nSelect,
						'MNI-option': N8nOption,
					},
				},
			});
			const getOption = (value: string) => within(container as HTMLElement).getByText(value);

			const textbox = container.querySelector('input')!;
			await userEvent.click(textbox);
			await waitFor(() => expect(getOption('1')).toBeVisible());
			await userEvent.click(getOption('1'));

			expect(textbox).toHaveValue('1');
		});
	});
});
