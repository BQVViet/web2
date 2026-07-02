const fs = require('fs');
const path = require('path');

const dir = 'd:/web2/admin/src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

for (let file of files) {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  
  // Text Colors
  content = content.replace(/color:\s*'white'/g, "color: 'inherit'");
  content = content.replace(/color:\s*"white"/g, "color: 'inherit'");
  content = content.replace(/color:\s*'#d1d5db'/g, "color: 'var(--text-secondary)'");
  content = content.replace(/color:\s*'#9ca3af'/g, "color: 'var(--text-muted)'");
  
  // Backgrounds
  content = content.replace(/background:\s*'rgba\(0,0,0,0\.3\)'/g, "background: 'var(--bg-surface)'");
  content = content.replace(/background:\s*'rgba\(0,0,0,0\.2\)'/g, "background: 'var(--bg-surface-hover)'");
  content = content.replace(/background:\s*'rgba\(255,255,255,0\.1\)'/g, "background: 'var(--border-color)'");
  content = content.replace(/background:\s*'rgba\(255,255,255,0\.05\)'/g, "background: 'var(--bg-surface)'");
  
  // Borders
  content = content.replace(/border:\s*'1px solid rgba\(255,255,255,0\.2\)'/g, "border: '1px solid var(--border-color)'");
  content = content.replace(/border:\s*'1px solid rgba\(255, 255, 255, 0\.05\)'/g, "border: '1px solid var(--border-color)'");
  content = content.replace(/border:\s*'1px solid rgba\(255,255,255,0\.05\)'/g, "border: '1px solid var(--border-color)'");
  content = content.replace(/border:\s*'2px dashed rgba\(255,255,255,0\.2\)'/g, "border: '2px dashed var(--border-color)'");
  
  // Primary Buttons (Red -> Blue)
  content = content.replace(/#e71a0f/g, "var(--primary-color)");
  content = content.replace(/linear-gradient\(135deg, #e71a0f 0%, #b9150b 100%\)/g, "var(--primary-color)");
  
  // Remove dark mode colorScheme on inputs
  content = content.replace(/,\s*colorScheme:\s*'dark'/g, "");
  
  fs.writeFileSync(path.join(dir, file), content);
}

// Also update App.jsx if needed?
const appJsxPath = path.join('d:/web2/admin/src', 'App.jsx');
let appContent = fs.readFileSync(appJsxPath, 'utf8');
appContent = appContent.replace(/color:\s*'white'/g, "color: 'inherit'");
appContent = appContent.replace(/background:\s*'#111827'/g, "background: 'var(--bg-main)'");
fs.writeFileSync(appJsxPath, appContent);

console.log('Replaced colors successfully!');
