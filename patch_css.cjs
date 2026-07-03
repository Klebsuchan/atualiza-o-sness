const fs = require('fs');

let content = fs.readFileSync('src/index.css', 'utf-8');
content += `

/* Anti-black-screen protections from ad networks */
html, body {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}
#root {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}
`;
fs.writeFileSync('src/index.css', content);
