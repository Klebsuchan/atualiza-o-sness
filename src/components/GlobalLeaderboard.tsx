import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Trophy, Medal } from 'lucide-react';
import { motion } from 'motion/react';

export function GlobalLeaderboard() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('xp', 'desc'), limit(20));
        const snapshot = await getDocs(q);
        
        let maxLvlUser = null;
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
        
        setLeaders(finalLeaders);
      } catch (e) {
        console.error("Error fetching leaderboard", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="glass p-6 rounded-2xl border border-white/10 animate-pulse h-64">
        <div className="h-8 bg-white/10 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass p-6 md:p-8 rounded-2xl border border-white/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Trophy className="w-48 h-48" />
      </div>
      
      <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-xbox-green uppercase tracking-widest relative z-10">
        <Trophy className="w-6 h-6" /> 
        Ranking Global
      </h3>
      
      <div className="flex flex-col gap-3 relative z-10">
        {leaders.length === 0 ? (
          <p className="text-text-dim text-sm py-4">Nenhum jogador encontrado.</p>
        ) : (
          leaders.map((user, index) => {
            const isMax = user.email === 'braian.kleber.camargo@gmail.com';
            const level = isMax ? 'MAX' : Math.floor((user.xp || 0) / 500) + 1;
            const xpDisplay = isMax ? 'MÁXIMO' : (user.xp || 0);
            
            return (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                key={user.id} 
                className={`flex items-center gap-4 p-3 rounded-xl border ${index === 0 ? 'bg-yellow-500/10 border-yellow-500/30' : index === 1 ? 'bg-zinc-300/10 border-zinc-300/30' : index === 2 ? 'bg-amber-700/10 border-amber-700/30' : 'bg-black/30 border-white/5'}`}
              >
                <div className="w-8 flex justify-center font-bold text-lg">
                  {index === 0 ? <Medal className="text-yellow-500" /> : index === 1 ? <Medal className="text-zinc-400" /> : index === 2 ? <Medal className="text-amber-600" /> : <span className="text-white/30">#{index + 1}</span>}
                </div>
                
                <img src={user.photoURL || "https://ui-avatars.com/api/?name=User"} alt={user.displayName} className={`w-10 h-10 rounded-full object-cover border-2 ${index === 0 ? 'border-yellow-500' : index === 1 ? 'border-zinc-400' : index === 2 ? 'border-amber-600' : 'border-white/10'}`} referrerPolicy="no-referrer" />
                
                <div className="flex-1">
                  <p className="font-bold text-white text-sm">{user.displayName || 'Jogador'}</p>
                  <p className="text-xbox-green text-xs font-bold tracking-widest">LVL {level}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-white font-black">{xpDisplay}</p>
                  <p className="text-[10px] text-text-dim uppercase tracking-widest">XP</p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
