import { baseConfig } from '@MNI/stylelint-config/base';

export default {
	...baseConfig,
	rules: {
		...baseConfig.rules,
		'@MNI/css-var-naming': [true, { severity: 'error' }],
	},
};
