const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  "const response = await fetch(targetUrl, {",
  `
      const joinCode = req.query.join;
      let fetchUrl = targetUrl;
      if (joinCode) {
        fetchUrl += (fetchUrl.includes('?') ? '&' : '?') + 'join=' + encodeURIComponent(joinCode);
      }
      const response = await fetch(fetchUrl, {
  `
);
fs.writeFileSync('server.ts', code);
