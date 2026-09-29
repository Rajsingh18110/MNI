const fs = require('fs');

const files = [
  './scripts/scan-mni-image.mjs',
  './packages/testing/playwright/scripts/build-test-image.mjs',
  './packages/testing/playwright/scripts/run-coverage-shard.mjs',
  './scripts/dockerize-mni.mjs',
  './scripts/smoke-mni-image.mjs'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content.replace(/n8nio\/n8n/g, 'mni/mni');
    if (content !== newContent) {
      fs.writeFileSync(file, newContent);
      console.log(`Updated ${file}`);
    }
  }
});
