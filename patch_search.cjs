const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add new state for searching
const stateTarget = 'const [friendSuccess, setFriendSuccess] = useState("");';
const stateReplacement = `const [friendSuccess, setFriendSuccess] = useState("");
  const [friendSearchResults, setFriendSearchResults] = useState<any[]>([]);
  const [isSearchingFriend, setIsSearchingFriend] = useState(false);`;
if (!code.includes('setFriendSearchResults')) {
  code = code.replace(stateTarget, stateReplacement);
}

// 2. Add search function
const searchFuncTarget = 'const handleAddFriend = async (';
const searchFuncReplacement = `
  const handleSearchFriend = async () => {
    if (!user || !friendIdInput.trim()) return;
    setIsSearchingFriend(true);
    setFriendError("");
    setFriendSuccess("");
    setFriendSearchResults([]);
    
    try {
      const searchTerm = friendIdInput.trim().toLowerCase();
      const usersRef = collection(db, 'users');
      const q = query(usersRef);
      const snapshot = await getDocs(q);
      
      const results: any[] = [];
      snapshot.forEach(doc => {
         const data = doc.data();
         if (doc.id === user.uid) return; // don't show self
         
         const nameMatch = data.displayName?.toLowerCase().includes(searchTerm);
         const emailMatch = data.email?.toLowerCase().includes(searchTerm);
         const idMatch = doc.id === friendIdInput.trim();
         
         if (nameMatch || emailMatch || idMatch) {
            results.push({ id: doc.id, ...data });
         }
      });
      
      if (results.length === 0) {
        setFriendError("Nenhum usuário encontrado com esse nome ou e-mail.");
      } else {
        setFriendSearchResults(results);
      }
    } catch (e: any) {
      console.error(e);
      setFriendError("Erro ao buscar usuários: " + e.message);
    }
    setIsSearchingFriend(false);
  };

  const handleAddFriend = async (targetId: string, targetData: any) => {
    if (!user) return;
    setAddingFriend(true);
    setFriendError("");
    setFriendSuccess("");
    try {
      const friendRef = doc(db, \`users/\${user.uid}/friends\`, targetId);
      await setDoc(friendRef, {
         addedAt: serverTimestamp(),
         displayName: targetData.displayName || "Unknown",
         photoURL: targetData.photoURL || "",
         userId: targetId
      });
      
      setFriendSuccess("Amigo adicionado!");
      setFriendSearchResults([]);
      setFriendIdInput("");
      fetchFriends();
    } catch (e: any) {
      console.error("Error adding friend", e);
      setFriendError("Erro: " + e.message);
    }
    setAddingFriend(false);
  };

  // Remove old handleAddFriend if it exists, wait, I will replace the old one entirely.
`;

// Replace the old handleAddFriend
const oldHandleAddFriendRegex = /const handleAddFriend = async \(\) => \{[\s\S]*?setAddingFriend\(false\);\n  \};/;
code = code.replace(oldHandleAddFriendRegex, searchFuncReplacement.trim());

// 3. Update the UI for Add Friend
const uiTarget = `                     <div className="flex-1 w-full">
                       <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim block mb-2">Adicionar Amigo</label>
                       <div className="flex items-center gap-2">
                         <input type="text" placeholder="ID do Amigo..." value={friendIdInput} onChange={(e) => setFriendIdInput(e.target.value)} className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white w-full outline-none focus:border-xbox-green" />
                         <button onClick={handleAddFriend} disabled={addingFriend || !friendIdInput.trim()} className="bg-xbox-green hover:bg-emerald-600 disabled:opacity-50 px-4 py-2 rounded-lg text-white font-bold transition-all">
                           {addingFriend ? '...' : 'Add'}
                         </button>
                       </div>
                     </div>`;

const uiReplacement = `                     <div className="flex-1 w-full">
                       <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim block mb-2">Buscar Amigo (Nome ou Email)</label>
                       <div className="flex items-center gap-2">
                         <input type="text" placeholder="Nome ou Email..." value={friendIdInput} onChange={(e) => setFriendIdInput(e.target.value)} className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white w-full outline-none focus:border-xbox-green" />
                         <button onClick={handleSearchFriend} disabled={isSearchingFriend || !friendIdInput.trim()} className="bg-xbox-green hover:bg-emerald-600 disabled:opacity-50 px-4 py-2 rounded-lg text-white font-bold transition-all whitespace-nowrap">
                           {isSearchingFriend ? '...' : 'Buscar'}
                         </button>
                       </div>
                     </div>`;

code = code.replace(uiTarget, uiReplacement);

// 4. Add search results UI right after friendError/friendSuccess
const resultsTarget = `                  {friendSuccess && <p className="text-xbox-green text-xs font-bold mb-4">{friendSuccess}</p>}
                  
                  {friends.length === 0 ? (`;

const resultsReplacement = `                  {friendSuccess && <p className="text-xbox-green text-xs font-bold mb-4">{friendSuccess}</p>}
                  
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

                  {friends.length === 0 ? (`;

code = code.replace(resultsTarget, resultsReplacement);

fs.writeFileSync('src/App.tsx', code);
