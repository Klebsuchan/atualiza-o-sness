const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Update import
code = code.replace("import { MegaDrivePlayer } from './components/MegaDrivePlayer';", "import { CloudPlayer } from './components/CloudPlayer';");

// Update the multiplayer block
const mpTarget = `                  {selectedGame.system === 'Mega Drive' && (
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6">
                    <h3 className="text-white font-bold mb-2 text-sm flex items-center gap-2"><Cloud className="w-4 h-4 text-blue-400" /> Multiplayer Online (Netplay)</h3>
                    <p className="text-text-dim text-xs mb-3">Para hospedar, inicie o jogo, e clique em "Netplay" na barra inferior para gerar um código/link. Para entrar no jogo de um amigo, cole o código ou link abaixo:</p>`;

const mpReplacement = `                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6">
                    <h3 className="text-white font-bold mb-2 text-sm flex items-center gap-2"><Cloud className="w-4 h-4 text-blue-400" /> Multiplayer Online (Netplay)</h3>
                    <p className="text-text-dim text-xs mb-3">
                      {selectedGame.system === 'Mega Drive' 
                         ? 'Para hospedar, inicie o jogo, e clique em "Netplay" na barra inferior para gerar um código/link. Para entrar no jogo de um amigo, cole o código ou link abaixo:'
                         : 'Para hospedar ou entrar, inicie o jogo, abra o Menu do Emulador e selecione Netplay. Ou use o código abaixo se suportado:'}
                    </p>`;

code = code.replace(mpTarget, mpReplacement);
code = code.replace(/                  }\)\}\n                  \n                  <div className="grid grid-cols-2/, '                  \n                  <div className="grid grid-cols-2');

// Update the player rendering
const playerTarget = `            <div className="flex-1 bg-black relative flex items-center justify-center pointer-events-auto">
              {selectedGame.playUrl ? (
                selectedGame.system === 'Mega Drive' ? (
                  <MegaDrivePlayer 
                    playUrl={selectedGame.playUrl} 
                    title={\`Cloud Session: \${selectedGame.title}\`} 
                    joinCode={activeJoinCode}
                    iframeRef={iframeRef as any}
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

const playerReplacement = `            <div className="flex-1 bg-black relative flex items-center justify-center pointer-events-auto">
              {selectedGame.playUrl ? (
                <CloudPlayer 
                  playUrl={selectedGame.playUrl} 
                  title={\`Cloud Session: \${selectedGame.title}\`} 
                  joinCode={activeJoinCode}
                  iframeRef={iframeRef as any}
                />
              ) : (`;

code = code.replace(playerTarget, playerReplacement);

fs.writeFileSync('src/App.tsx', code);
