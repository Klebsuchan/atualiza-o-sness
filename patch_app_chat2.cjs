const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import { ChatComponent }')) {
  code = code.replace(
    'import { CloudPlayer } from "./components/CloudPlayer";', 
    'import { CloudPlayer } from "./components/CloudPlayer";\nimport { ChatComponent } from "./components/ChatComponent";'
  );
}

const target = `<CloudPlayer 
                  playUrl={selectedGame.playUrl} 
                  title={\`Cloud Session: \${selectedGame.title}\`} 
                  iframeRef={iframeRef as any}
                  joinCode={activeJoinCode}
                />`;
const replacement = `<CloudPlayer 
                  playUrl={selectedGame.playUrl} 
                  title={\`Cloud Session: \${selectedGame.title}\`} 
                  iframeRef={iframeRef as any}
                  joinCode={activeJoinCode}
                />
                
                {activeJoinCode && (
                  <ChatComponent sessionId={activeJoinCode} />
                )}`;

if (!code.includes('<ChatComponent')) {
  code = code.replace(target, replacement);
  console.log("ChatComponent injected into player UI");
}

fs.writeFileSync('src/App.tsx', code);
