const fs = require('fs');

const files = [
  './README.md',
  './docker/images/mni/README.md',
  './packages/frontend/@n8n/design-system/README.md',
  './packages/frontend/editor-ui/README.md',
  './packages/core/README.md',
  './packages/@n8n/nodes-langchain/README.md',
  './packages/@n8n/workflow-sdk/README.md',
  './packages/node-dev/README.md',
  './packages/nodes-base/README.md',
  './packages/workflow/README.md'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content.replace(/!\[Banner image\]\(https:\/\/user-images\.githubusercontent\.com\/[^)]+\)/g, '![MNI Banner](https://raw.githubusercontent.com/Rajsingh18110/MNI/main/assets/mni-screenshot-readme.png)');
    newContent = newContent.replace(/!\[n8n\.io - Workflow Automation\]\(https:\/\/user-images\.githubusercontent\.com\/[^)]+\)/g, '![MNI - Workflow Automation](https://raw.githubusercontent.com/Rajsingh18110/MNI/main/assets/mni-screenshot-readme.png)');
    if (content !== newContent) {
      fs.writeFileSync(file, newContent);
      console.log(`Updated ${file}`);
    }
  }
});
