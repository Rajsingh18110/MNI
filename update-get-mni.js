const fs = require('fs');

const files = [
  './docker/test-get-mni.sh',
  './docker/get-mni.sh',
  './docker/get-mni-compose.yml'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content.replace(/get-n8n/g, 'get-mni');
    if (content !== newContent) {
      fs.writeFileSync(file, newContent);
      console.log(`Updated ${file}`);
    }
  }
});
