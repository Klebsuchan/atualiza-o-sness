const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');
content = content.replace(
  /function GameRow\(\{ title, games, onGameClick, onSeeAll \}: \{ title: string, games: Game\[\], onGameClick: \(g: Game\) => void, onSeeAll\?: \(\) => void \}\) \{/,
  `function GameRow({ title, games, onGameClick, onSeeAll }: { title: string, games: Game[], onGameClick: (g: Game) => void, onSeeAll?: () => void }) {\n  const { t } = useLanguage();`
);
// Also replace '{t("game.save_cloud")}' string literal in App.tsx
content = content.replace(/'\{t\("game\.save_cloud"\)\}'/, `t("game.save_cloud")`);

fs.writeFileSync('src/App.tsx', content);
