import { defineConfig, globalIgnores } from 'eslint/config';
import { baseConfig } from '@MNI/eslint-config/base';

export default defineConfig(baseConfig, globalIgnores(['src/grammar*.ts']), {
	rules: {
		'no-useless-escape': 'warn',
		'@typescript-eslint/no-unsafe-enum-comparison': 'off',
	},
});
