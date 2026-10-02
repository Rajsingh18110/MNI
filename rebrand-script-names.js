const fs = require('fs');
const files = [
  './package.json',
  './.github/workflows/docker-build-smoke.yml'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/scripts\/build-MNI\.mjs/g, 'scripts/build-mni.mjs');
    content = content.replace(/scripts\/dockerize-MNI\.mjs/g, 'scripts/dockerize-mni.mjs');
    content = content.replace(/scripts\/scan-MNI-image\.mjs/g, 'scripts/scan-mni-image.mjs');
    content = content.replace(/scripts\/smoke-MNI-image\.mjs/g, 'scripts/smoke-mni-image.mjs');
    content = content.replace(/"build:MNI":/g, '"build:mni":');
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
