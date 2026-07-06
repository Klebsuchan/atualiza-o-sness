const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldBlock = `            <div className="flex-1 bg-black relative flex items-center justify-center pointer-events-auto">
              {selectedGame.playUrl ? (
                selectedGame.system === 'Mega Drive' ? (
                  <MegaDrivePlayer 
                    playUrl={selectedGame.playUrl} 
                    title={\`Cloud Session: \${selectedGame.title}\`} 
                    iframeRef={iframeRef as any}
                    joinCode={activeJoinCode}
                  />
                ) : (
                  <iframe 
                    ref={iframeRef}
                    key={selectedGame.id}
                    src={selectedGame.playUrl}
                    className="w-full h-full border-none shadow-2xl"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-modals"
                    onLoad={() => {
                      iframeRef.current?.focus();
                    }}
                    title={\`Cloud Session: \${selectedGame.title}\`}
                  ></iframe>
                )
              ) : (`;

const newBlock = `            <div className="flex-1 bg-black relative flex items-center justify-center pointer-events-auto">
              {selectedGame.playUrl ? (
                <CloudPlayer 
                  playUrl={selectedGame.playUrl} 
                  title={\`Cloud Session: \${selectedGame.title}\`} 
                  iframeRef={iframeRef as any}
                  joinCode={activeJoinCode}
                />
              ) : (`;

if (code.includes(oldBlock)) {
  console.log("Found old block!");
  code = code.replace(oldBlock, newBlock);
} else {
  console.log("Could not find old block");
}

fs.writeFileSync('src/App.tsx', code);
