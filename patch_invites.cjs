const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add state for invitations
const stateTarget = 'const [friends, setFriends] = useState<any[]>([]);';
const stateReplacement = `const [friends, setFriends] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [inviteFriendId, setInviteFriendId] = useState("");
`;
if (!code.includes('setInvitations')) {
  code = code.replace(stateTarget, stateReplacement);
}

// 2. Add functions
const functionsTarget = 'const fetchFriends = async () => {';
const functionsReplacement = `
  const handleSendInvite = async () => {
    if (!user || !inviteFriendId || !joinCodeInput.trim() || !selectedGame) return;
    try {
      const inviteRef = doc(collection(db, \`users/\${inviteFriendId}/invitations\`));
      await setDoc(inviteRef, {
        fromUserId: user.uid,
        fromUserName: user.displayName || 'Alguém',
        gameId: selectedGame.id,
        gameTitle: selectedGame.title,
        joinCode: joinCodeInput.trim(),
        createdAt: serverTimestamp()
      });
      alert("Convite enviado com sucesso!");
    } catch (e) {
      console.error(e);
      alert("Erro ao enviar convite.");
    }
  };

  const deleteInvite = async (inviteId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, \`users/\${user.uid}/invitations\`, inviteId));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!user) {
      setInvitations([]);
      return;
    }
    const unsubscribe = onSnapshot(collection(db, \`users/\${user.uid}/invitations\`), (snap) => {
      const inv = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInvitations(inv);
    });
    return () => unsubscribe();
  }, [user]);

  const fetchFriends = async () => {`;
if (!code.includes('handleSendInvite')) {
  code = code.replace(functionsTarget, functionsReplacement);
}

// 3. Update Multiplayer Online UI
const uiTarget = `                      <button 
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
                  </div>`;
const uiReplacement = `                      <button 
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
                    
                    {user && friends.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim block">Ou Convide um Amigo (Cole seu código acima)</label>
                        <div className="flex gap-2">
                          <select 
                            className="bg-black/50 border border-white/20 rounded-lg px-2 text-sm text-white flex-1 focus:border-xbox-green outline-none"
                            value={inviteFriendId}
                            onChange={(e) => setInviteFriendId(e.target.value)}
                          >
                            <option value="">Selecione um amigo...</option>
                            {friends.map(f => <option key={f.userId} value={f.userId}>{f.displayName}</option>)}
                          </select>
                          <button 
                            className="bg-white/10 hover:bg-white/20 text-white font-bold px-3 py-2 rounded-lg text-xs transition-all uppercase tracking-widest disabled:opacity-50"
                            onClick={(e) => { e.stopPropagation(); handleSendInvite(); }}
                            disabled={!inviteFriendId || !joinCodeInput.trim()}
                          >
                            Convidar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>`;
if (!code.includes('handleSendInvite()')) {
  code = code.replace(uiTarget, uiReplacement);
}

// 4. Update the global layout to show invitations
const globalUiTarget = `      {/* Game Player */}`;
const globalUiReplacement = `      {/* Invitations Notification Overlay */}
      {invitations.length > 0 && !isPlaying && (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
          {invitations.map(inv => (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={inv.id} className="bg-zinc-900 border border-xbox-green/50 shadow-[0_0_15px_rgba(16,124,16,0.3)] rounded-xl p-4 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                   <h4 className="font-bold text-sm text-xbox-green flex items-center gap-2"><Gamepad2 className="w-4 h-4" /> Novo Convite</h4>
                   <button onClick={() => deleteInvite(inv.id)} className="text-white/40 hover:text-white"><X className="w-4 h-4" /></button>
                </div>
                <p className="text-xs text-white mb-3"><strong>{inv.fromUserName}</strong> chamou você para jogar <strong>{inv.gameTitle}</strong>!</p>
                <button 
                  onClick={() => {
                     const game = GAMES.find(g => g.id === inv.gameId) || ps1Games.find(g => g.id === inv.gameId);
                     if (game) {
                        setSelectedGame(game);
                        setActiveJoinCode(inv.joinCode);
                        setIsPlaying(true);
                     }
                     deleteInvite(inv.id);
                  }}
                  className="bg-xbox-green hover:bg-emerald-600 text-white font-bold py-2 rounded-md text-xs uppercase tracking-widest transition-all"
                >
                  Aceitar e Jogar
                </button>
             </motion.div>
          ))}
        </div>
      )}

      {/* Game Player */}`;
if (!code.includes('Invitations Notification Overlay')) {
  code = code.replace(globalUiTarget, globalUiReplacement);
}

fs.writeFileSync('src/App.tsx', code);
