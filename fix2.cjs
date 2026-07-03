const fs = require('fs');

let content = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf-8');
content = content.replace(/You don't have/, `You do not have`);
fs.writeFileSync('src/contexts/LanguageContext.tsx', content);
