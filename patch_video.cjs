const fs = require('fs');

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');
content = content.replace(/animate=\{\{ opacity: \[0, 1, 0\] \}\}/, `animate={{ opacity: [0.2, 1, 0.2] }}`);
fs.writeFileSync('src/components/LandingPage.tsx', content);
