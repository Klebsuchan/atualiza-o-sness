const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import { ChatComponent }')) {
  code = code.replace("import { CloudPlayer }", "import { CloudPlayer } from './components/CloudPlayer';\nimport { ChatComponent } from './components/ChatComponent';");
  // wait, the CloudPlayer might already be imported or not. Let's use another import.
}
