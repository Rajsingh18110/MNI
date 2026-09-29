const fs = require('fs');

const files = process.argv.slice(2);

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content.replace(/n8n-logo\.png/g, 'mni-logo.png')
                            .replace(/n8n-screenshot\.png/g, 'mni-screenshot.png')
                            .replace(/n8n-screenshot-readme\.png/g, 'mni-screenshot-readme.png');
    if (content !== newContent) {
      fs.writeFileSync(file, newContent);
      console.log(`Updated ${file}`);
    }
  }
});
