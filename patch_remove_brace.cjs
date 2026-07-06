const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace("                  </div>\n                  )}\n                  \n                  <div className=\"grid grid-cols-2 gap-4 mb-8 text-[10px] md:text-xs\">", "                  </div>\n                  \n                  <div className=\"grid grid-cols-2 gap-4 mb-8 text-[10px] md:text-xs\">");
fs.writeFileSync('src/App.tsx', code);
