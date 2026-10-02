const fs = require('fs');
const files = {
  'src/controllers/e2e.controller.ts': [433],
  'src/modules/community-packages/community-node-types.controller.ts': [13],
  'src/modules/dynamic-credentials.ee/dynamic-credentials.controller.ts': [133, 178],
  'src/modules/dynamic-credentials.ee/workflow-status.controller.ts': [72, 81, 92],
  'src/modules/external-secrets.ee/external-secrets.controller.ee.ts': [25],
  'src/modules/instance-ai/browser/instance-ai-browser-session.service.ts': [133, 144],
  'src/modules/instance-ai/eval/llm-wire-server.ts': [205, 227, 260, 288],
  'src/server.ts': [365, 379, 380, 381, 382],
  'src/webhooks/webhook-request-handler.ts': [191, 203]
};

for (const [file, lines] of Object.entries(files)) {
  const path = 'packages/cli/' + file;
  const content = fs.readFileSync(path, 'utf8').split('\n');
  for (const line of lines) {
    let text = content[line - 1];
    text = text.replace(/req\.header\([^)]+\)/g, '(req.header($1) as string)');
    text = text.replace(/req\.headers\[[^\]]+\]/g, '($& as string)');
    content[line - 1] = text;
  }
  fs.writeFileSync(path, content.join('\n'));
}
