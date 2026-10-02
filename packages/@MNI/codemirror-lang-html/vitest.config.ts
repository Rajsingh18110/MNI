import { createVitestConfig } from '@MNI/vitest-config/node';

export default createVitestConfig({ include: ['test/**/test-*.ts', 'test/**/test-*.js'] });
