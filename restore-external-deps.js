const fs = require('fs');
const path = require('path');

function getPackageJsonPaths(dir, paths = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (['node_modules', '.git', 'dist', 'build', '.turbo'].includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getPackageJsonPaths(fullPath, paths);
    } else if (entry.name === 'package.json') {
      paths.push(fullPath);
    }
  }
  return paths;
}

const rootDir = __dirname;
const allPackageJsons = getPackageJsonPaths(rootDir);

const workspacePackageNames = new Set();
// First pass: gather all workspace package names
for (const p of allPackageJsons) {
  try {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (data.name) {
      workspacePackageNames.add(data.name);
    }
  } catch (e) {}
}

console.log('Workspace packages:', workspacePackageNames.size);

// Second pass: fix dependencies in all package.json files
for (const p of allPackageJsons) {
  try {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    let changed = false;
    
    ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
      if (data[depType]) {
        for (const dep of Object.keys(data[depType])) {
          if (dep.startsWith('@MNI/') || dep.startsWith('MNI-')) {
            if (!workspacePackageNames.has(dep)) {
              // It's an external dependency that was mistakenly renamed.
              const originalName = dep.replace('@MNI/', '@n8n/').replace('MNI-', 'n8n-');
              console.log(`Reverting ${dep} to ${originalName} in ${p}`);
              data[depType][originalName] = data[depType][dep];
              delete data[depType][dep];
              changed = true;
            }
          }
        }
      }
    });

    if (changed) {
      fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
    }
  } catch (e) {}
}

// We also need to fix pnpm-workspace.yaml if it contains wrong references?
// pnpm-workspace.yaml should be fine if it just has path wildcards.
