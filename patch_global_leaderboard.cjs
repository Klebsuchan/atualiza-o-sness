const fs = require('fs');
let code = fs.readFileSync('src/components/GlobalLeaderboard.tsx', 'utf8');

const targetFetch = `        const results: any[] = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          if (data.email !== 'braian.kleber.camargo@gmail.com') {
            results.push({ id: doc.id, ...data });
          }
        });
        
        setLeaders(results.slice(0, 10)); // Take top 10`;

const replacementFetch = `        let maxLvlUser = null;
        const results: any[] = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          if (data.email === 'braian.kleber.camargo@gmail.com') {
            maxLvlUser = { id: doc.id, ...data };
          } else {
            results.push({ id: doc.id, ...data });
          }
        });
        
        // Se não achou nos top 20, tenta buscar especificamente
        if (!maxLvlUser) {
          const { where } = await import('firebase/firestore');
          const maxLvlQuery = query(usersRef, where('email', '==', 'braian.kleber.camargo@gmail.com'), limit(1));
          const maxLvlSnapshot = await getDocs(maxLvlQuery);
          if (!maxLvlSnapshot.empty) {
            maxLvlUser = { id: maxLvlSnapshot.docs[0].id, ...maxLvlSnapshot.docs[0].data() };
          } else {
            // Fallback caso ainda nao exista
            maxLvlUser = { 
              id: 'max-lvl-id', 
              displayName: 'Braian', 
              email: 'braian.kleber.camargo@gmail.com',
              photoURL: 'https://ui-avatars.com/api/?name=Braian'
            };
          }
        }
        
        const finalLeaders = results.slice(0, 9);
        if (maxLvlUser) {
          finalLeaders.unshift(maxLvlUser);
        }
        
        setLeaders(finalLeaders);`;

code = code.replace(targetFetch, replacementFetch);

const targetRender = `            const level = Math.floor((user.xp || 0) / 500) + 1;
            return (`;

const replacementRender = `            const isMax = user.email === 'braian.kleber.camargo@gmail.com';
            const level = isMax ? 'MAX' : Math.floor((user.xp || 0) / 500) + 1;
            const xpDisplay = isMax ? 'MÁXIMO' : (user.xp || 0);
            
            return (`;

code = code.replace(targetRender, replacementRender);

const targetXp = `<p className="text-white font-black">{user.xp || 0}</p>`;
const replacementXp = `<p className="text-white font-black">{xpDisplay}</p>`;

code = code.replace(targetXp, replacementXp);

fs.writeFileSync('src/components/GlobalLeaderboard.tsx', code);
