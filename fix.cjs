const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');
content = content.replace(/\{gamepadConnected \? "\{t\("game\.controls_auto"\)\}" : "\{t\("game\.controls_manual"\)\}" \}/, `{gamepadConnected ? t("game.controls_auto") : t("game.controls_manual")}`);
fs.writeFileSync('src/App.tsx', content);
