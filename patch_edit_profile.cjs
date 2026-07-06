const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Import updateProfile if not present
if (!code.includes('updateProfile')) {
  code = code.replace("import { signInWithPopup", "import { updateProfile, signInWithPopup");
}
if (!code.includes('import { updateProfile }') && !code.includes('updateProfile,')) {
    code = code.replace("import { signInWithPopup", "import { updateProfile, signInWithPopup");
}

// 2. Add State for Profile Edit
const stateTarget = `const [friendSuccess, setFriendSuccess] = useState("");`;
const stateReplacement = `const [friendSuccess, setFriendSuccess] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editPhotoURL, setEditPhotoURL] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const handleOpenEditProfile = () => {
    if (user) {
      setEditDisplayName(user.displayName || "");
      setEditPhotoURL(user.photoURL || "");
      setIsEditingProfile(true);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSavingProfile(true);
    try {
      // Update Firebase Auth Profile
      const { updateProfile } = await import('firebase/auth');
      await updateProfile(user, {
        displayName: editDisplayName,
        photoURL: editPhotoURL
      });
      
      // Update Firestore User Document
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        displayName: editDisplayName,
        photoURL: editPhotoURL
      }, { merge: true });
      
      setIsEditingProfile(false);
      // Force reload auth state if necessary, but onSnapshot might handle it, or we just rely on react state. Actually, changing user object directly is not recommended, but reloading window works or we can just let context handle it.
      window.location.reload();
    } catch (e: any) {
      console.error(e);
      alert("Erro ao salvar perfil: " + e.message);
    }
    setIsSavingProfile(false);
  };
`;

if (!code.includes('setIsEditingProfile(false)')) {
  code = code.replace(stateTarget, stateReplacement);
}

// 3. Add Edit Button in the UI
const buttonTarget = `<button 
                      onClick={logout}
                      className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-5 py-2.5 rounded-md font-bold text-xs uppercase tracking-widest transition-all"
                    >
                      <LogOut className="w-4 h-4" /> Sair
                    </button>`;

const buttonReplacement = `<div className="flex items-center gap-3">
                      <button 
                        onClick={handleOpenEditProfile}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-md font-bold text-xs uppercase tracking-widest transition-all"
                      >
                        Editar Perfil
                      </button>
                      <button 
                        onClick={logout}
                        className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-5 py-2.5 rounded-md font-bold text-xs uppercase tracking-widest transition-all"
                      >
                        <LogOut className="w-4 h-4" /> Sair
                      </button>
                    </div>`;

code = code.replace(buttonTarget, buttonReplacement);

// 4. Add the Edit Profile Modal
const modalTarget = `{/* Friends Section */}`;
const modalReplacement = `
                {/* Edit Profile Modal */}
                {isEditingProfile && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-zinc-900 border border-white/10 p-6 md:p-8 rounded-2xl w-full max-w-md shadow-2xl">
                      <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest">Editar Perfil</h3>
                      
                      <div className="flex flex-col gap-4 mb-6">
                        <div>
                          <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim block mb-2">Nickname (Nome de exibição)</label>
                          <input 
                            type="text" 
                            value={editDisplayName} 
                            onChange={(e) => setEditDisplayName(e.target.value)} 
                            className="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white w-full outline-none focus:border-xbox-green" 
                            placeholder="Seu nickname..."
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim block mb-2">URL da Foto de Perfil</label>
                          <input 
                            type="text" 
                            value={editPhotoURL} 
                            onChange={(e) => setEditPhotoURL(e.target.value)} 
                            className="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white w-full outline-none focus:border-xbox-green" 
                            placeholder="https://..."
                          />
                        </div>
                        
                        {editPhotoURL && (
                          <div className="flex items-center gap-4 mt-2 p-4 bg-white/5 rounded-xl border border-white/5">
                            <img src={editPhotoURL} onError={(e) => (e.currentTarget.src = "https://ui-avatars.com/api/?name=Error")} className="w-16 h-16 rounded-full object-cover border-2 border-xbox-green" />
                            <span className="text-xs text-text-dim font-bold uppercase tracking-widest">Preview</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-3">
                        <button 
                          onClick={() => setIsEditingProfile(false)}
                          disabled={isSavingProfile}
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all disabled:opacity-50"
                        >
                          Cancelar
                        </button>
                        <button 
                          onClick={handleSaveProfile}
                          disabled={isSavingProfile || !editDisplayName.trim()}
                          className="flex-1 bg-xbox-green hover:bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all disabled:opacity-50"
                        >
                          {isSavingProfile ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Friends Section */}`;

if (!code.includes('isEditingProfile &&')) {
  code = code.replace(modalTarget, modalReplacement);
}

fs.writeFileSync('src/App.tsx', code);
