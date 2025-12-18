const fs = require('fs');
const path = require('path');

const filePath = 'c:\\xampp\\htdocs\\jaikod\\src\\app\\product\\[slug]\\page.tsx';

// Read file
let content = fs.readFileSync(filePath, 'utf8');

// Remove duplicate closing tags (lines 145-147)
content = content.replace(/}\r?\n        <\/div >\r?\n    \)\r?\n}/g, '}');

// Write back
fs.writeFileSync(filePath, content, 'utf8');

console.log('Fixed syntax error!');
