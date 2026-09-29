const fs = require('fs');
const path = require('path');

const enJsonPath = path.join(__dirname, 'packages/frontend/@n8n/i18n/src/locales/en.json');
let enJson = fs.readFileSync(enJsonPath, 'utf8');

// Replace "MNI" with "MNI" in user-facing text cautiously
// We will replace occurrences where it's a standalone word or "MNI's" etc.
// But we won't replace @n8n or docs.n8n.io blindly.
const replaceMap = {
    '"About MNI"': '"About MNI"',
    'MNI version': 'MNI Version',
    'n8n.io': 'MNI',
    '"MNI editor"': '"MNI Editor"',
    'MNI Assistant': 'MNI Assistant',
    'MNI AI': 'MNI AI',
    'access to MNI': 'access to MNI',
    'using MNI': 'using MNI',
    'Ask MNI': 'Ask MNI',
    'MNI chat': 'MNI chat',
    'About MNI': 'About MNI',
    'MNI has been updated': 'MNI has been updated',
    'MNI cloud': 'MNI Cloud',
    'MNI community': 'MNI Community',
    'MNI Templates': 'MNI Templates',
    'Welcome to MNI': 'Welcome to MNI',
    'MNI instance': 'MNI instance'
};

for (const [key, value] of Object.entries(replaceMap)) {
    // global replacement for each specific phrase
    const regex = new RegExp(key, 'g');
    enJson = enJson.replace(regex, value);
}

fs.writeFileSync(enJsonPath, enJson);
console.log('Rebranded en.json');
