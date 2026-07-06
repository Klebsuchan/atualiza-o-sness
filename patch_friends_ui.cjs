const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const uiTarget = `                  )}
                </div>
                
                <div className="mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                    <Gamepad2 className="w-6 h-6 text-xbox-green" /> Jogos Salvos ({savedGames.length})`;

const uiReplacement = `                  )}
                </div>
                
                {/* Friends Section */}
                <div className="mb-12 glass p-6 md:p-8 rounded-2xl border border-white/10">
                  <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                    <User className="w-6 h-6 text-xbox-green" /> Meus Amigos ({friends.length})
                  </h3>
                  
                  <div className="mb-6 flex flex-col md:flex-row gap-4 items-end">
                     <div className="flex-1 w-full">
                       <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim block mb-2">Seu ID (Envie para um amigo)</label>
                       <div className="flex items-center gap-2">
                         <input type="text" readOnly value={user.uid} className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white w-full outline-none font-mono" />
                         <button onClick={() => { navigator.clipboard.writeText(user.uid); alert("ID Copiado!"); }} className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white font-bold transition-all whitespace-nowrap">
                           Copiar
                         </button>
                       </div>
                     </div>
                     <div className="flex-1 w-full">
                       <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim block mb-2">Adicionar Amigo</label>
                       <div className="flex items-center gap-2">
                         <input type="text" placeholder="ID do Amigo..." value={friendIdInput} onChange={(e) => setFriendIdInput(e.target.value)} className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white w-full outline-none focus:border-xbox-green" />
                         <button onClick={handleAddFriend} disabled={addingFriend || !friendIdInput.trim()} className="bg-xbox-green hover:bg-emerald-600 disabled:opacity-50 px-4 py-2 rounded-lg text-white font-bold transition-all">
                           {addingFriend ? '...' : 'Add'}
                         </button>
                       </div>
                     </div>
                  </div>
                  
                  {friendError && <p className="text-red-400 text-xs font-bold mb-4">{friendError}</p>}
                  {friendSuccess && <p className="text-xbox-green text-xs font-bold mb-4">{friendSuccess}</p>}
                  
                  {friends.length === 0 ? (
                    <p className="text-text-dim text-sm text-center py-4">Você ainda não adicionou nenhum amigo.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {friends.map((f: any) => (
                        <div key={f.id} className="bg-black/30 p-4 rounded-xl border border-white/5 flex items-center gap-4">
                           <img src={f.photoURL || "https://ui-avatars.com/api/?name=Guest"} alt="Friend" className="w-12 h-12 rounded-full object-cover border-2 border-white/10" referrerPolicy="no-referrer" />
                           <div>
                             <p className="font-bold text-white text-sm">{f.displayName}</p>
                             <p className="text-text-dim text-[10px] font-mono">{f.userId.substring(0,10)}...</p>
                           </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                    <Gamepad2 className="w-6 h-6 text-xbox-green" /> Jogos Salvos ({savedGames.length})`;

code = code.replace(uiTarget, uiReplacement);
fs.writeFileSync('src/App.tsx', code);
