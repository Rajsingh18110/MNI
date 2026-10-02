const fs = require('fs');
const path = require('path');

const EXCLUDED_DIRS = ['.git', 'node_modules', 'dist', 'build', '.turbo'];
const EXCLUDED_FILES = ['pnpm-lock.yaml', 'smart-rename.js'];

// Regex for replacing n8n to MNI
function replaceContent(content) {
  let newContent = content
    .replace(/N8N_/g, 'MNI_')
    .replace(/@n8n\//g, '@MNI/')
    .replace(/\/n8n\//g, '/MNI/')
    .replace(/n8n-(?!io)/g, 'MNI-')
    .replace(/-n8n/g, '-MNI')
    .replace(/n8n_/g, 'MNI_')
    .replace(/n8n:/g, 'MNI:')
    .replace(/\bn8n\b(?!\.[a-z]{2,})/g, 'MNI')
    .replace(/\bN8n\b/g, 'Mni')
    .replace(/\bN8N\b/g, 'MNI');
  return newContent;
}

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  // First, process contents and rename files
  for (const entry of entries) {
    if (EXCLUDED_DIRS.includes(entry.name) || EXCLUDED_FILES.includes(entry.name)) {
      continue;
    }
    
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else {
      // It's a file, read and replace content
      const stat = fs.statSync(fullPath);
      if (stat.size < 5000000) { // skip very large files
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.includes('n8n') || content.includes('N8n') || content.includes('N8N')) {
            const newContent = replaceContent(content);
            if (newContent !== content) {
              fs.writeFileSync(fullPath, newContent, 'utf8');
            }
          }
        } catch (e) {
          // ignore binary files or read errors
        }
      }
      
      // Rename file if name contains n8n
      if (entry.name.includes('n8n') || entry.name.includes('N8n') || entry.name.includes('N8N')) {
        const newName = replaceContent(entry.name);
        if (newName !== entry.name) {
          const newPath = path.join(dir, newName);
          if (!fs.existsSync(newPath)) {
            fs.renameSync(fullPath, newPath);
          }
        }
      }
    }
  }
  
  // Then rename directories (bottom-up)
  for (const entry of entries) {
    if (EXCLUDED_DIRS.includes(entry.name)) continue;
    if (entry.isDirectory()) {
      const fullPath = path.join(dir, entry.name);
      if (entry.name.includes('n8n') || entry.name.includes('N8n') || entry.name.includes('N8N')) {
        const newName = replaceContent(entry.name);
        if (newName !== entry.name) {
          const newPath = path.join(dir, newName);
          if (!fs.existsSync(newPath)) {
            fs.renameSync(fullPath, newPath);
          } else {
             // If destination exists, merge contents manually
             mergeDirectories(fullPath, newPath);
             fs.rmSync(fullPath, { recursive: true, force: true });
          }
        }
      }
    }
  }
}

function mergeDirectories(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath);
      }
      mergeDirectories(srcPath, destPath);
    } else {
      if (!fs.existsSync(destPath)) {
        fs.renameSync(srcPath, destPath);
      }
    }
  }
}

console.log('Starting smart rename...');
processDirectory(__dirname);
console.log('Done!');
