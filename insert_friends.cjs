const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<div className="mb-4">\s*<h3 className="text-xl font-bold flex items-center gap-2 mb-6">\s*<Gamepad2 className="w-6 h-6 text-xbox-green" \/> Jogos Salvos \(\{savedGames\.length\}\)\s*<\/h3>/;

const replacement = `
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
                       <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim block mb-2">Buscar Amigo (Nome ou Email)</label>
                       <div className="flex items-center gap-2">
                         <input type="text" placeholder="Nome ou Email..." value={friendIdInput} onChange={(e) => setFriendIdInput(e.target.value)} className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white w-full outline-none focus:border-xbox-green" />
                         <button onClick={handleSearchFriend} disabled={isSearchingFriend || !friendIdInput.trim()} className="bg-xbox-green hover:bg-emerald-600 disabled:opacity-50 px-4 py-2 rounded-lg text-white font-bold transition-all whitespace-nowrap">
                           {isSearchingFriend ? '...' : 'Buscar'}
                         </button>
                       </div>
                     </div>
                  </div>
                  
                  {friendError && <p className="text-red-400 text-xs font-bold mb-4">{friendError}</p>}
                  {friendSuccess && <p className="text-xbox-green text-xs font-bold mb-4">{friendSuccess}</p>}
                  
                  {friendSearchResults.length > 0 && (
                     <div className="mb-6 bg-black/40 p-4 rounded-xl border border-white/10">
                       <h4 className="text-xs font-bold text-white mb-3 uppercase tracking-widest">Resultados da Busca</h4>
                       <div className="flex flex-col gap-3">
                         {friendSearchResults.map(res => (
                            <div key={res.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                               <div className="flex items-center gap-3">
                                 <img src={res.photoURL || "https://ui-avatars.com/api/?name=Guest"} className="w-8 h-8 rounded-full" />
                                 <div>
                                    <p className="text-sm font-bold text-white">{res.displayName}</p>
                                    <p className="text-xs text-text-dim">{res.email}</p>
                                 </div>
                               </div>
                               <button 
                                 onClick={() => handleAddFriend(res.id, res)}
                                 disabled={addingFriend || friends.some(f => f.userId === res.id)}
                                 className="bg-xbox-green/20 hover:bg-xbox-green text-xbox-green hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                               >
                                 {friends.some(f => f.userId === res.id) ? 'Já Adicionado' : 'Adicionar'}
                               </button>
                            </div>
                         ))}
                       </div>
                     </div>
                  )}

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
                    <Gamepad2 className="w-6 h-6 text-xbox-green" /> Jogos Salvos ({savedGames.length})
                  </h3>`;

if (regex.test(code)) {
  code = code.replace(regex, replacement);
  console.log("Replaced using regex!");
} else {
  console.log("Regex did not match");
}

fs.writeFileSync('src/App.tsx', code);
