const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', '.next');
const scriptTag = '<script src="/dashboard-console-capture.js"></script>';

function injectIntoHtml(dir) {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      injectIntoHtml(fullPath);
    } else if (file.name.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (!content.includes('dashboard-console-capture.js')) {
        content = content.replace('<head>', '<head>' + scriptTag);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Injected console capture into:', fullPath);
      }
    }
  }
}

injectIntoHtml(outDir);
console.log('Console capture injection complete.');