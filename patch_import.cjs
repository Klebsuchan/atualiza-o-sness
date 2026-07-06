const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace('import { MegaDrivePlayer } from "./components/MegaDrivePlayer";', 'import { CloudPlayer } from "./components/CloudPlayer";');
fs.writeFileSync('src/App.tsx', code);
