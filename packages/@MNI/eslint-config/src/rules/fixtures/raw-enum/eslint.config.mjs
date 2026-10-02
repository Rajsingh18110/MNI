import { localRulesPlugin } from '@MNI/eslint-config/plugin';
import tseslint from 'typescript-eslint';

export default tseslint.config({
	files: ['**/*.ts'],
	languageOptions: { parser: tseslint.parser },
	plugins: { 'MNI-local-rules': localRulesPlugin },
	rules: { 'MNI-local-rules/no-raw-enum': 'error' },
});
