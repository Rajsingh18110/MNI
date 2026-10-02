const fs = require('fs');
const path = require('path');

const EXCLUDED_DIRS = ['.git', 'node_modules', 'dist', 'build', '.turbo'];
const EXCLUDED_FILES = ['pnpm-lock.yaml'];

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (EXCLUDED_DIRS.includes(entry.name) || EXCLUDED_FILES.includes(entry.name)) {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else {
      const stat = fs.statSync(fullPath);
      if (stat.size < 5000000) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.includes('eslint-plugin-n8n-nodes-base')) {
             const newContent = content.replace(/eslint-plugin-n8n-nodes-base/g, 'eslint-plugin-n8n-nodes-base');
             if (newContent !== content) {
               fs.writeFileSync(fullPath, newContent, 'utf8');
             }
          }
        } catch (e) {}
      }
    }
  }
}

console.log('Starting restore of eslint-plugin-n8n-nodes-base...');
processDirectory(__dirname);
console.log('Done!');
