import { ESLintUtils } from '@typescript-eslint/utils';

const REPO_URL = 'https://github.com/MNI-io/MNI';
const DOCS_PATH = 'blob/master/packages/@MNI/eslint-plugin-community-nodes/docs/rules';

export const createRule = ESLintUtils.RuleCreator((name) => `${REPO_URL}/${DOCS_PATH}/${name}.md`);
