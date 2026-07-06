const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `<CloudPlayer 
                  playUrl={selectedGame.playUrl} 
                  title={\`Cloud Session: \${selectedGame.title}\`} 
                  iframeRef={iframeRef as any}
                  joinCode={activeJoinCode}
                />
                
                {activeJoinCode && (
                  <ChatComponent sessionId={activeJoinCode} />
                )}`;

const replacement = `<>
                <CloudPlayer 
                  playUrl={selectedGame.playUrl} 
                  title={\`Cloud Session: \${selectedGame.title}\`} 
                  iframeRef={iframeRef as any}
                  joinCode={activeJoinCode}
                />
                {activeJoinCode && (
                  <ChatComponent sessionId={activeJoinCode} />
                )}
                </>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
