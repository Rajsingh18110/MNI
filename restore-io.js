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
          let newContent = content;
          if (content.includes('@n8n_io') || content.includes('@n8n/sandbox-client') || content.includes('n8n_io')) {
             newContent = content
               .replace(/@n8n_io/g, '@n8n_io')
               .replace(/n8n_io/g, 'n8n_io')
               .replace(/@MNI\/sandbox-client/g, '@n8n/sandbox-client');
             if (newContent !== content) {
               fs.writeFileSync(fullPath, newContent, 'utf8');
             }
          }
        } catch (e) {}
      }
    }
  }
}

console.log('Starting restore of external dependencies...');
processDirectory(__dirname);
console.log('Done!');
