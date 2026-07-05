const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');
if (!content.includes('import { MegaDrivePlayer }')) {
  content = content.replace(
    /import \{ GAMES, Game \} from "\.\/data\/games";/,
    `import { GAMES, Game } from "./data/games";\nimport { MegaDrivePlayer } from "./components/MegaDrivePlayer";`
  );
  fs.writeFileSync('src/App.tsx', content);
}
