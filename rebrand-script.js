const fs = require('fs');
const path = require('path');

const enJsonPath = path.join(__dirname, 'packages/frontend/@n8n/i18n/src/locales/en.json');
let enJson = fs.readFileSync(enJsonPath, 'utf8');

// Replace "n8n" with "MNI" in user-facing text cautiously
// We will replace occurrences where it's a standalone word or "n8n's" etc.
// But we won't replace @n8n or docs.n8n.io blindly.
const replaceMap = {
    '"About n8n"': '"About MNI"',
    'n8n Version': 'MNI Version',
    'n8n.io': 'MNI',
    '"n8n Editor"': '"MNI Editor"',
    'n8n Assistant': 'MNI Assistant',
    'n8n AI': 'MNI AI',
    'access to n8n': 'access to MNI',
    'using n8n': 'using MNI',
    'Ask n8n': 'Ask MNI',
    'n8n chat': 'MNI chat',
    'About n8n': 'About MNI',
    'n8n has been updated': 'MNI has been updated',
    'n8n Cloud': 'MNI Cloud',
    'n8n Community': 'MNI Community',
    'n8n Templates': 'MNI Templates',
    'Welcome to n8n': 'Welcome to MNI',
    'n8n instance': 'MNI instance'
};

for (const [key, value] of Object.entries(replaceMap)) {
    // global replacement for each specific phrase
    const regex = new RegExp(key, 'g');
    enJson = enJson.replace(regex, value);
}

fs.writeFileSync(enJsonPath, enJson);
console.log('Rebranded en.json');
