import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithPopup, signOut, onAuthStateChanged, browserPopupRedirectResolver } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, getDocFromServer, onSnapshot } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

export interface UserStats {
  playDaysCount: number;
  xp: number;
  level: number;
  nextLevelXp: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  userStats: UserStats | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  useEffect(() => {
    // Validate Connection to Firestore globally as directed safely
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error: any) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. You might be offline or blocked.");
        }
      }
    };
    testConnection();

    let unsubscribeSnapshot: (() => void) | undefined;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // Ensure user document exists upon auth state load
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          const today = new Date().toISOString().split('T')[0];

          if (!userSnap.exists()) {
            await setDoc(userRef, {
              userId: currentUser.uid,
              displayName: currentUser.displayName || '',
              email: currentUser.email || '',
              photoURL: currentUser.photoURL || '',
              createdAt: serverTimestamp(),
              lastLoginAt: serverTimestamp(),
              playDaysCount: 1,
              lastPlayedDate: today,
              xp: 100
            });
          } else {
            const data = userSnap.data();
            let newPlayDaysCount = data.playDaysCount || 1;
            let newXp = data.xp || 100;
            
            if (data.lastPlayedDate !== today) {
                newPlayDaysCount += 1;
                newXp += 50; // Daily login bonus
            }

            await setDoc(userRef, { 
              lastLoginAt: serverTimestamp(),
              lastPlayedDate: today,
              playDaysCount: newPlayDaysCount,
              xp: newXp
            }, { merge: true });
          }

          // Listen to changes for realtime updates
          unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              const xp = data.xp || 0;
              const level = Math.floor(xp / 500) + 1;
              const nextLevelXp = level * 500;
              
              setUserStats({
                playDaysCount: data.playDaysCount || 1,
                xp: xp,
                level: level,
                nextLevelXp: nextLevelXp
              });
            }
          });

        } catch (e: any) {
          console.error('Failed to update/init user doc:', e);
          if (e.message?.includes('offline') || e.message?.includes('network')) {
            setError('Sem conexão com o banco de dados (Offline). O progresso será sincronizado assim que a conexão voltar.');
          }
        }
      } else {
        setUserStats(null);
        if (unsubscribeSnapshot) {
          unsubscribeSnapshot();
        }
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, []);

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const loginWithGoogle = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);

    setError(null);
    try {
      // Force popup resolver to handle iframe quirks in Preview
      await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
      setIsLoggingIn(false);
    } catch (err: any) {
      setIsLoggingIn(false);
      console.error("Error logging in with Google:", err);
      // Determine if it was blocked by iframe/browser strictness
      if (err.code === 'auth/popup-blocked') {
        setError('O pop-up de login foi bloqueado pelo seu navegador. Por favor, permita pop-ups para este site ou abra o aplicativo em uma nova guia para fazer o login.');
      } else if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request' || err.message?.includes('INTERNAL ASSERTION FAILED')) {
        setError('O login foi interrompido (pop-up fechado) ou bloqueado devido ao ambiente. Se o botão não estiver respondendo, clique no botão "Abrir App em Nova Guia" no topo da sua tela (↗️) para fazer login sem restrições.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('O domínio atual não está autorizado no Firebase. Por favor, adicione as URLs deste app na lista de "Authorized domains" nas configurações de Authentication do Firebase Console.');
      } else {
        setError(`Erro de autenticação: ${err.message}`);
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setError(null);
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout, error, userStats }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

