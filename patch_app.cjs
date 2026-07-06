const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add joinCodeInput state
if (!code.includes("const [joinCodeInput")) {
  code = code.replace(
    'const [searchQuery, setSearchQuery] = useState("");',
    'const [searchQuery, setSearchQuery] = useState("");\n  const [joinCodeInput, setJoinCodeInput] = useState("");\n  const [activeJoinCode, setActiveJoinCode] = useState<string | undefined>();'
  );
}

// Modify setIsPlaying to reset activeJoinCode if no join code is passed, wait
// When user clicks the cover (solo play), it should reset activeJoinCode.
code = code.replace(
  'onClick={() => setIsPlaying(true)}',
  'onClick={() => { setActiveJoinCode(undefined); setIsPlaying(true); }}'
);

// Add the multiplayer section
const mpHtml = `
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6 mt-4">
                    <h3 className="text-white font-bold mb-2 text-sm flex items-center gap-2"><Gamepad2 className="w-4 h-4 text-xbox-green" /> Multiplayer Local</h3>
                    <p className="text-text-dim text-xs">Conecte vários controles USB ou Bluetooth. O emulador reconhecerá automaticamente o Player 1 e Player 2.</p>
                  </div>
                  
                  {selectedGame.system === 'Mega Drive' && (
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6">
                    <h3 className="text-white font-bold mb-2 text-sm flex items-center gap-2"><Cloud className="w-4 h-4 text-blue-400" /> Multiplayer Online (Netplay)</h3>
                    <p className="text-text-dim text-xs mb-3">Para hospedar, inicie o jogo, e clique em "Netplay" na barra inferior para gerar um código/link. Para entrar no jogo de um amigo, cole o código ou link abaixo:</p>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Código de Join..." 
                        className="bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-sm text-white flex-1 focus:border-xbox-green outline-none"
                        value={joinCodeInput}
                        onChange={(e) => setJoinCodeInput(e.target.value)}
                      />
                      <button 
                        className="bg-xbox-green hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg text-sm transition-all"
                        onClick={(e) => {
                           e.stopPropagation();
                           let code = joinCodeInput.trim();
                           if (code.includes('join=')) {
                              code = new URLSearchParams(code.split('?')[1]).get('join') || code;
                           }
                           setActiveJoinCode(code);
                           setIsPlaying(true);
                        }}
                      >
                        Entrar
                      </button>
                    </div>
                  </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 mb-8 text-[10px] md:text-xs">
`;
code = code.replace(/<div className="grid grid-cols-2 gap-4 mb-8 text-\[10px\] md:text-xs">/, mpHtml);

// Pass activeJoinCode to MegaDrivePlayer
code = code.replace(
  'iframeRef={iframeRef as any}',
  'iframeRef={iframeRef as any}\n                    joinCode={activeJoinCode}'
);

fs.writeFileSync('src/App.tsx', code);
