const fs = require('fs');
const files = [
  './.github/scripts/docker/should-smoke-build.test.mjs',
  './.github/WORKFLOWS.md',
  './.github/workflows/docker-build-smoke.yml',
  './.github/workflows/build-base-image.yml',
  './scripts/dockerize-MNI.mjs',
  './scripts/build-MNI.mjs',
  './docker/images/mni/Dockerfile',
  './docker/docker-bake.hcl',
  './.dockerignore',
  './packages/testing/playwright/scripts/backend-coverage-resolver.ts',
  './packages/testing/test-impact/src/changes.test.ts',
  './packages/testing/test-impact/src/select.test.ts'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/docker\/images\/MNI-base/g, 'docker/images/mni-base');
    content = content.replace(/docker\/images\/MNI/g, 'docker/images/mni');
    content = content.replace(/images\/MNI/g, 'images/mni');
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
