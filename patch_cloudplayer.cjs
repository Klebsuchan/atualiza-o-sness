const fs = require('fs');
let code = fs.readFileSync('src/components/CloudPlayer.tsx', 'utf8');
code = code.replace(/MegaDrivePlayer/g, 'CloudPlayer');
code = code.replace(
  "  if (playUrl.includes('ssega.com')) {\n    finalUrl = `/api/ssega-embed?url=${encodeURIComponent(playUrl)}`;\n    if (joinCode) {\n      finalUrl += `&join=${encodeURIComponent(joinCode)}`;\n    }\n  }",
  "  if (playUrl.includes('ssega.com')) {\n    finalUrl = `/api/ssega-embed?url=${encodeURIComponent(playUrl)}`;\n    if (joinCode) {\n      finalUrl += `&join=${encodeURIComponent(joinCode)}`;\n    }\n  } else {\n    if (joinCode) {\n      finalUrl += (finalUrl.includes('?') ? '&' : '?') + `join=${encodeURIComponent(joinCode)}`;\n    }\n  }"
);
fs.writeFileSync('src/components/CloudPlayer.tsx', code);
