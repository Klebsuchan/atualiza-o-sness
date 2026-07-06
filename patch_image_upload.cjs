const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add handleImageUpload function after handleSaveProfile
const funcTarget = `const handleSaveProfile = async () => {`;
const imageUploadFunc = `
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 300;
        const MAX_HEIGHT = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height *= MAX_WIDTH / width));
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width *= MAX_HEIGHT / height));
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setEditPhotoURL(dataUrl);
        }
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {`;

if (!code.includes('handleImageUpload')) {
  code = code.replace(funcTarget, imageUploadFunc);
}

// 2. Replace URL input with File input in Edit Profile Modal
const uiTarget = `<div>
                          <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim block mb-2">URL da Foto de Perfil</label>
                          <input 
                            type="text" 
                            value={editPhotoURL} 
                            onChange={(e) => setEditPhotoURL(e.target.value)} 
                            className="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white w-full outline-none focus:border-xbox-green" 
                            placeholder="https://..."
                          />
                        </div>`;

const uiReplacement = `<div>
                          <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim block mb-2">Foto de Perfil</label>
                          <div className="flex items-center gap-4">
                            <input 
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload} 
                              className="text-sm text-text-dim file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all cursor-pointer" 
                            />
                            {editPhotoURL && (
                              <button type="button" onClick={() => setEditPhotoURL("")} className="text-red-400 text-xs font-bold uppercase tracking-widest hover:text-red-300">
                                Remover
                              </button>
                            )}
                          </div>
                        </div>`;

if (code.includes(uiTarget)) {
  code = code.replace(uiTarget, uiReplacement);
  console.log("Replaced UI successfully");
} else {
  console.log("Could not find UI target");
}

fs.writeFileSync('src/App.tsx', code);
