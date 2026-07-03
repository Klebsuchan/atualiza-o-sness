const fs = require('fs');

let content = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf-8');
content = content.replace(/We didn't find/, `We did not find`);
fs.writeFileSync('src/contexts/LanguageContext.tsx', content);
