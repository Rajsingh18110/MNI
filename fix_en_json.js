const fs = require('fs');
const file = 'packages/frontend/@n8n/i18n/src/locales/en.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

function replaceN8n(str) {
  if (typeof str !== 'string') return str;
  // skip urls
  if (str.includes('http://') || str.includes('https://') || str.includes('docs.n8n.io') || str.includes('npmjs.com')) {
    // maybe only replace outside of URLs, but it's easier to just replace MNI safely.
    // Let's replace ' MNI ' with ' MNI ', 'MNI ' with 'MNI ', ' MNI' with ' MNI', 'MNI's' with 'MNI's'.
    return str.replace(/\bn8n\b/g, 'MNI');
  }
  return str.replace(/\bn8n\b/gi, 'MNI');
}

for (const key in data) {
  // skip technical keys but update the value
  if (data[key] && typeof data[key] === 'string') {
    // Preserve license mention if needed, or replace.
    // The instructions say: "About screen... preserve technically necessary information such as: version, license... Do not falsely claim that MNI is the original author of n8n."
    if (key.includes('license') || key.includes('License')) continue;
    
    // safe replace
    let val = data[key];
    val = val.replace(/(?<!https?:\/\/[^\s]+)\bn8n\b/g, 'MNI');
    val = val.replace(/(?<!https?:\/\/[^\s]+)\bN8N\b/g, 'MNI');
    
    data[key] = val;
  }
}

fs.writeFileSync(file, JSON.stringify(data, null, '\t') + '\n');
