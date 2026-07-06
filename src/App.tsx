/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Gamepad2, 
  Search, 
  Home, 
  Library, 
  User, 
  Settings, 
  Play, 
  Star, 
  X,
  Maximize2,
  Cloud,
  LogOut,
  Radio
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GAMES, Game } from "./data/games";
import { CloudPlayer } from "./components/CloudPlayer";
import { ChatComponent } from "./components/ChatComponent";
import { GlobalLeaderboard } from "./components/GlobalLeaderboard";
import { ps1Games } from "./data/ps1Games";
import { useAuth } from "./contexts/AuthContext";
import { db } from "./lib/firebase";
import { collection, query, getDocs, getDoc, onSnapshot, doc, setDoc, serverTimestamp, deleteDoc, increment } from "firebase/firestore";
import { useGamepad } from "./hooks/useGamepad";
import { LandingPage } from "./components/LandingPage";
import { useLanguage } from "./contexts/LanguageContext";
import { TipOfTheDay } from "./components/TipOfTheDay";

// Helper component for Image resolving
function PexelsImage({ fallbackUrl, className, alt }: { queryName: string, category: string, orientation: 'landscape'|'portrait', fallbackUrl: string, className: string, alt: string }) {
  const [hasError, setHasError] = useState(false);

  return (
    <img 
      src={hasError ? "https://images.pexels.com/photos/1373114/pexels-photo-1373114.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1" : fallbackUrl} 
      alt={alt} 
      className={className} 
      referrerPolicy="no-referrer" 
      onError={() => {
        if (!hasError) setHasError(true);
      }}
    />
  );
}

export default function App() {
  const { t, language, setLanguage } = useLanguage();
  const [hasEntered, setHasEntered] = useState(false);
  const [isLoadingGames, setIsLoadingGames] = useState(true);
  const [liveGames, setLiveGames] = useState<Game[]>([]);
  const [livePS1Games, setLivePS1Games] = useState<Game[]>([]);
  const { user, loginWithGoogle, logout, loading, error, userStats } = useAuth();
  
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [activeJoinCode, setActiveJoinCode] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState("home");
  const [featuredGame, setFeaturedGame] = useState<Game>(GAMES[0]);
  const [savedGames, setSavedGames] = useState<any[]>([]);
  const [savingRecord, setSavingRecord] = useState(false);
  const [friends, setFriends] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [inviteFriendId, setInviteFriendId] = useState("");

  const [friendIdInput, setFriendIdInput] = useState("");
  const [addingFriend, setAddingFriend] = useState(false);
  const [friendError, setFriendError] = useState("");
  const [friendSuccess, setFriendSuccess] = useState("");
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

  const [friendSearchResults, setFriendSearchResults] = useState<any[]>([]);
  const [isSearchingFriend, setIsSearchingFriend] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleGamepadPress = useCallback((btnIdx: number) => {
    // se o jogador está com o emulador ligado, DEIXE o iframe absorver os comandos para jogar o jogo! Nao feche.
    if (isPlaying) {
      // Except possibly an emergency exit combo. Let's just avoid intercepting while playing.
      return; 
    }

    if (selectedGame) {
      // Na tela de Overlay: Botão B do SNES (0 - Inferior) fecha a tela
      if (btnIdx === 0) {
        setSelectedGame(null);
      }
      // Botão A do SNES (1 - Direita) inicia o jogo
      if (btnIdx === 1) {
        setIsPlaying(true);
      }
    } else {
      // Se tiver na Home e quiserem puxar o perfil sem mouse
      if (btnIdx === 2) { // Botão Y do SNES (Esquerda)
         setActiveTab(prev => prev === 'profile' ? 'home' : 'profile');
      }
    }
  }, [isPlaying, selectedGame]);

  const { connected: gamepadConnected } = useGamepad(handleGamepadPress);

  useEffect(() => {
    const loadRealGames = async () => {
      setIsLoadingGames(true);
      await new Promise(resolve => setTimeout(resolve, 800)); 
      setLiveGames([...GAMES]);
      setLivePS1Games(ps1Games.map(g => ({...g, system: 'PS1'})));
      setFeaturedGame(GAMES[0]);
      setIsLoadingGames(false);
    };
    
    loadRealGames();
  }, []);

  useEffect(() => {
    if (isPlaying && iframeRef.current) {
      setTimeout(() => {
         iframeRef.current?.focus();
      }, 500); 
    }
  }, [isPlaying]);

  useEffect(() => {
    if (user && activeTab === "profile") {
      fetchSavedGames();
      fetchFriends();
    }
  }, [user, activeTab]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && user) {
      interval = setInterval(async () => {
        try {
          const userRef = doc(db, 'users', user.uid);
          await setDoc(userRef, {
             xp: increment(8)
          }, { merge: true });
        } catch (e) {
          console.error("Error adding gameplay XP:", e);
        }
      }, 60000); // 1 minute
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, user]);

  
  
  const handleSendInvite = async () => {
    if (!user || !inviteFriendId || !joinCodeInput.trim() || !selectedGame) return;
    try {
      const inviteRef = doc(collection(db, `users/${inviteFriendId}/invitations`));
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
      await deleteDoc(doc(db, `users/${user.uid}/invitations`, inviteId));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!user) {
      setInvitations([]);
      return;
    }
    const unsubscribe = onSnapshot(collection(db, `users/${user.uid}/invitations`), (snap) => {
      const inv = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInvitations(inv);
    });
    return () => unsubscribe();
  }, [user]);

  const fetchFriends = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, `users/${user.uid}/friends`));
      const querySnapshot = await getDocs(q);
      const friendsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFriends(friendsList);
    } catch (e) {
      console.error("Error fetching friends:", e);
    }
  };

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
      const friendRef = doc(db, `users/${user.uid}/friends`, targetId);
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

  const fetchSavedGames = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, `users/${user.uid}/games`));
      const querySnapshot = await getDocs(q);
      const gamesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSavedGames(gamesList.sort((a: any, b: any) => b.lastPlayedAt - a.lastPlayedAt));
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  const handleSaveProgress = async (game: Game) => {
    if (!user) {
      alert(`Faça login no ${t("app.profile")} para salvar seu progresso na nuvem!`);
      return;
    }
    
    setSavingRecord(true);
    try {
      const gameRef = doc(db, `users/${user.uid}/games`, game.id);
      await setDoc(gameRef, {
        gameId: game.id,
        title: game.title,
        lastPlayedAt: serverTimestamp(),
        isSaved: true,
        thumbnailUrl: game.imageUrl
      }, { merge: true });
      // fake delay for UX
      await new Promise(resolve => setTimeout(resolve, 800));
      alert(`Progresso do sistema atualizado para ${game.title} na Cloud! Lembre-se, para salvar o seu ponto exato físico no jogo, utilize as opções internas do emulador.`);
    } catch (error) {
      console.error("Error saving progress:", error);
      alert("Erro ao salvar progresso no banco.");
    } finally {
      setSavingRecord(false);
    }
  };

  const filteredGames = [...liveGames, ...livePS1Games].filter(game => 
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!hasEntered) {
    return <LandingPage onEnter={() => setHasEntered(true)} />;
  }

  if (isLoadingGames) {
    return (
      <div className="h-[100dvh] bg-xbox-bg flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-xbox-green/20 border-t-xbox-green rounded-full animate-spin"></div>
        <div className="flex flex-col items-center gap-2">
           <h2 className="text-xl font-black italic tracking-tighter">{t("loading.sync")}</h2>
           <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.3em]">{t("loading.real_lib")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] overflow-hidden bg-xbox-bg text-white">
      {/* Sidebar Rail (Tablet & PC) / Bottom Nav (Mobile) */}
      <nav className="w-full min-h-[calc(4rem+env(safe-area-inset-bottom,0px))] md:min-h-0 md:h-full md:w-20 order-last md:order-first flex md:flex-col items-center justify-around md:justify-start py-0 md:py-8 border-t md:border-t-0 md:border-r border-white/5 bg-black/40 backdrop-blur-2xl z-50 pb-[env(safe-area-inset-bottom,0px)]">
        <div className="hidden md:block mb-12">
          <img src="/logo.png" alt="Wonder Games Cloud" className="w-10 h-10 object-contain" />
        </div>
        
        <div className="flex md:flex-col gap-3 md:gap-8 items-center justify-start md:justify-around w-full md:w-auto overflow-x-auto scrollbar-hide px-4 py-2 md:px-0 md:py-0 md:overflow-visible">          <NavItem icon={Home} label="Home" active={activeTab === "home"} onClick={() => setActiveTab("home")} />          <NavItem icon={Gamepad2} label="SNES" active={activeTab === "snes"} onClick={() => setActiveTab("snes")} />          <NavItem icon={Gamepad2} label={t("app.sega")} active={activeTab === "megadrive"} onClick={() => setActiveTab("megadrive")} />          <NavItem icon={Radio} label="PS1" active={activeTab === "ps1"} onClick={() => setActiveTab("ps1")} />          <NavItem icon={Library} label="Biblioteca" active={activeTab === "library"} onClick={() => setActiveTab("library")} />          <NavItem icon={Search} label="Buscar" active={activeTab === "search"} onClick={() => setActiveTab("search")} />          <div className="hidden md:block">            <NavItem icon={User} label="Perfil" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />          </div>                    <div className="md:hidden flex-shrink-0">             <div                 className="w-10 h-10 rounded-full bg-gradient-to-br from-xbox-green to-emerald-800 border-2 border-white/20 overflow-hidden cursor-pointer"                onClick={() => user ? setActiveTab("profile") : loginWithGoogle()}             >               <img src={user?.photoURL || "https://ui-avatars.com/api/?name=Guest&background=107C10&color=fff"} alt="Profile" referrerPolicy="no-referrer" className="w-full h-full object-cover" />             </div>          </div>        </div>

        <div className="hidden md:flex flex-col gap-8 mt-auto px-4 w-full items-center">
          {/* Reserving space for future integrations like Settings */}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative scroll-smooth bg-[radial-gradient(circle_at_top_right,_#1a2a1a_0%,_#050505_60%)]">
        {/* Top bar with Search (Mobile-ish or Expanded Search) */}
        <header className="sticky top-0 z-40 flex flex-col gap-2 px-4 md:px-8 py-3 md:py-4 bg-gradient-to-b from-xbox-bg/90 to-transparent backdrop-blur-md">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4 glass px-4 py-2 rounded-full w-full max-w-md focus-within:border-xbox-green/50 focus-within:bg-white/10 transition-all">
              <Search className="w-4 h-4 text-white/50" />
              <input 
                type="text" 
                placeholder={t("app.search")} 
                value={searchQuery}
                onChange={(e) => {setSearchQuery(e.target.value); setActiveTab("search");}}
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-text-dim"
              />
            </div>
            <div className="hidden md:flex items-center gap-6"><button onClick={() => setLanguage(language === "pt" ? "en" : "pt")} className="flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 w-8 h-8 rounded-full text-xs font-bold uppercase transition-colors">{language}</button>
              {gamepadConnected && (
                <div className="hidden md:flex items-center gap-2 bg-xbox-green/20 border border-xbox-green/50 px-3 py-1.5 rounded-full text-xbox-green">
                  <Gamepad2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{t("app.controller_connected")}</span>
                </div>
              )}
              <div className="flex items-center gap-2 group cursor-pointer" onClick={() => user ? setActiveTab("profile") : loginWithGoogle()}>
                <span className="text-sm font-medium text-text-dim group-hover:text-white transition-colors hidden md:block">
                  {user ? `Bem-vindo, ${user.displayName?.split(' ')[0]}` : 'Entrar na Conta'}
                </span>
                <div className="w-8 h-8 rounded-full border-2 border-xbox-green shadow-[0_0_10px_rgba(16,124,16,0.5)] overflow-hidden">
                  <img src={user?.photoURL || "https://ui-avatars.com/api/?name=Guest&background=107C10&color=fff"} alt="Avatar" referrerPolicy="no-referrer" />
                </div>
              </div>
            </div>
          </div>
          {error && activeTab !== "profile" && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-2 px-4 rounded-md text-xs flex justify-between items-center w-full shadow-lg">
              <span>{error} {error.includes('bloqueado') && "Clique em 'Abrir em Nova Janela' se necessário."}</span>
              {error.includes('bloqueado') && (
                <button onClick={() => window.open(window.location.href, '_blank')} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded font-bold uppercase tracking-wider text-[10px]">
                  ↗️ Nova Janela
                </button>
              )}
            </div>
          )}
        </header>

        {/* Hero Section */}
        {activeTab === "home" && !searchQuery && (
          <section className="relative px-4 md:px-8 pt-2 md:pt-4 pb-8 md:pb-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-video md:aspect-[21/9] w-full rounded-xl md:rounded-2xl overflow-hidden group shadow-2xl border border-glass-border"
            >
              <PexelsImage 
                queryName={featuredGame.title}
                category={featuredGame.category}
                orientation="landscape"
                fallbackUrl={featuredGame.bannerUrl} 
                alt={featuredGame.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-3 md:mb-4">
                    <span className="bg-xbox-green px-1.5 md:px-2 py-0.5 rounded text-[8px] md:text-[10px] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(16,124,16,0.5)]">{featuredGame.system === 'PS1' ? 'PS1 Classic' : featuredGame.system === 'Mega Drive' ? 'Mega Drive Classic' : 'SNES Classic'}</span>
                    <span className="flex items-center gap-1 text-[10px] md:text-xs font-medium text-yellow-400">
                      <Star className="w-3 h-3 fill-current" /> {featuredGame.rating}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold mb-2 md:mb-4 tracking-tighter text-white leading-tight">
                    {featuredGame.title}
                  </h1>
                  <p className="max-w-xl text-xs md:text-lg text-text-dim mb-6 md:mb-8 line-clamp-2 md:line-clamp-none leading-relaxed">
                    {featuredGame.description}
                  </p>
                  <div className="flex items-center gap-3 md:gap-4">
                    <button 
                      onClick={() => { setSelectedGame(featuredGame); setIsPlaying(true); }}
                      className="bg-xbox-green text-white px-5 md:px-8 py-2 md:py-3 rounded-md font-bold text-xs md:text-base flex items-center gap-2 hover:brightness-110 transition-all shadow-xl active:scale-95 uppercase tracking-wider"
                    >
                      <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" /> {t("app.play")}
                    </button>
                    <button 
                      onClick={() => setSelectedGame(featuredGame)}
                      className="glass hover:bg-white/10 px-5 md:px-6 py-2 md:py-3 rounded-md font-bold text-xs md:text-base transition-all"
                    >
                      Detalhes
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </section>
        )}


        
        {/* Profile Section */}
        {activeTab === "profile" && (
          <div className="px-4 md:px-8 py-6">
            {!user ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <User className="w-16 h-16 text-white/20 mb-4" />
                <h2 className="text-2xl font-bold mb-2">{t("auth.not_connected")}</h2>
                <p className="text-text-dim mb-6 max-w-md">{t("auth.login_reason")}</p>
                <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                  <button 
                    onClick={loginWithGoogle}
                    className="bg-xbox-green hover:brightness-110 px-8 py-3 rounded-md font-bold flex items-center justify-center gap-2 transition-all uppercase tracking-widest shadow-[0_0_15px_rgba(16,124,16,0.3)] w-full"
                  >
                    <Cloud className="w-5 h-5 fill-current" /> {t("profile.login_btn")}
                  </button>
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-md text-xs text-left w-full">
                      <strong>{t("error.title")}</strong> {error}
                      {error.includes('bloqueado') && (
                         <div className="mt-2 pt-2 border-t border-red-500/20">
                           <p>{t("error.open_new_window")} <strong>{t("error.new_window_link")}</strong>:</p>
                           <button onClick={() => window.open(window.location.href, '_blank')} className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded uppercase tracking-wider font-bold w-full">{t("error.btn_new_window")}</button>
                         </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-col mb-12 gap-6 glass p-6 md:p-8 rounded-2xl border border-xbox-green/30">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 w-full">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-xbox-green shadow-[0_0_20px_rgba(16,124,16,0.5)] overflow-hidden">
                          <img src={user.photoURL || "https://ui-avatars.com/api/?name=Guest&background=107C10&color=fff"} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        {userStats && (
                          <div className="absolute -bottom-2 -right-2 bg-xbox-green text-white font-extrabold text-xs md:text-sm px-2 py-1 rounded-full border-2 border-black shadow-[0_0_10px_rgba(16,124,16,1)]">
                            LVL {user.email === 'braian.kleber.camargo@gmail.com' ? 'MAX' : userStats.level}
                          </div>
                        )}
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-extrabold">{user.displayName}</h2>
                        <p className="text-text-dim">{user.email}</p>
                        <div className="mt-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-xbox-green">
                          <Cloud className="w-4 h-4 fill-current" />
                          Conta Conectada à Cloud
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
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
                    </div>
                  </div>
                  
                  {userStats && (
                    <div className="mt-4 pt-6 border-t border-white/10 w-full flex flex-col gap-4">
                      <div className="flex justify-between items-center text-sm font-bold uppercase tracking-wider">
                        <span className="text-white/60">{t("profile.xp")}</span>
                        <span className="text-xbox-green">{user.email === 'braian.kleber.camargo@gmail.com' ? 'MÁXIMO' : `${userStats.xp} / ${userStats.nextLevelXp} XP`}</span>
                      </div>
                      <div className="w-full bg-black/50 rounded-full h-3 border border-white/10 overflow-hidden relative">
                        <div 
                          className="bg-gradient-to-r from-emerald-600 to-xbox-green h-full rounded-full relative transition-all duration-1000 ease-out" 
                          style={{ width: user.email === 'braian.kleber.camargo@gmail.com' ? '100%' : `${Math.min(100, Math.max(0, ((userStats.xp - ((userStats.level - 1) * 500)) / 500) * 100))}%` }}
                        >
                          <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-shimmer"></div>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-2">
                        <div className="flex-1 bg-black/30 p-4 rounded-xl border border-white/5 text-center">
                          <p className="text-3xl font-black text-white mb-1">{userStats.playDaysCount}</p>
                          <p className="text-[10px] md:text-xs text-text-dim uppercase tracking-widest font-bold">{t("profile.days_played")}</p>
                        </div>
                        <div className="flex-1 bg-black/30 p-4 rounded-xl border border-white/5 text-center">
                          <p className="text-3xl font-black text-white mb-1">{savedGames.length}</p>
                          <p className="text-[10px] md:text-xs text-text-dim uppercase tracking-widest font-bold">{t("profile.saved_games")}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                               
                
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

               <div className="mb-12">
                  <GlobalLeaderboard />
               </div>

               <div className="mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                    <Gamepad2 className="w-6 h-6 text-xbox-green" /> Jogos Salvos ({savedGames.length})
                  </h3>
                  {savedGames.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {savedGames.map((sg) => (
                        <div key={sg.id} className="group cursor-pointer" onClick={() => {
                          const found = [...liveGames, ...livePS1Games].find(g => g.id === sg.gameId) || [...GAMES, ...ps1Games].find(g => g.id === sg.gameId); 
                          if (found) {
                            setSelectedGame(found);
                            setIsPlaying(true);
                          }
                        }}>
                          <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 border border-glass-border shadow-lg transition-all duration-300 group-hover:border-xbox-green/50 bg-black/50">
                            <PexelsImage 
                              queryName={sg.title}
                              category={[...GAMES, ...ps1Games].find(g => g.id === sg.gameId)?.category || 'Aventura'}
                              orientation="portrait"
                              fallbackUrl={sg.thumbnailUrl} 
                              alt={sg.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 opacity-90 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                              <button className="bg-xbox-green text-white p-2 rounded-full w-fit mx-auto mb-2 shadow-[0_0_15px_rgba(16,124,16,0.6)] hover:scale-110 transition-transform">
                                <Play className="w-6 h-6 fill-current pl-1" />
                              </button>
                            </div>
                            <div className="absolute top-2 right-2 bg-xbox-green text-white px-2 py-0.5 rounded text-[8px] uppercase font-bold shadow-lg">{t("profile.saved")}</div>
                          </div>
                          <h4 className="font-semibold text-xs tracking-tight line-clamp-1 group-hover:text-xbox-green transition-colors">{sg.title}</h4>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 glass rounded-xl border border-white/5">
                      <p className="text-text-dim">{t("profile.no_saves")}</p>
                      <p className="text-xs text-white/40 mt-2">{t("profile.no_saves_desc")}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Game Rows - Home */}
        {activeTab === "home" && !searchQuery && (
          <div className="space-y-12 pb-24">
            <TipOfTheDay games={[...liveGames, ...livePS1Games]} onPlayGame={setSelectedGame} />
            <GameRow 
              title="Recomendados para você" 
              games={GAMES.slice(0, 10)} 
              onGameClick={setSelectedGame}
              onSeeAll={() => setActiveTab("library")}
            />
            <GameRow 
              title="Clássicos da Aventura" 
              games={GAMES.filter(g => g.category === "Aventura" || g.category === "Ação-Aventura")} 
              onGameClick={setSelectedGame}
              onSeeAll={() => { setSearchQuery("Aventura"); setActiveTab("search"); }}
            />
            <GameRow 
              title="Velocidade Máxima" 
              games={GAMES.filter(g => g.category === "Corrida")} 
              onGameClick={setSelectedGame}
              onSeeAll={() => { setSearchQuery("Corrida"); setActiveTab("search"); }}
            />
            <GameRow 
              title="Favoritos dos Fãs" 
              games={GAMES.filter(g => g.rating >= 4.9 || g.id.includes('mario'))} 
              onGameClick={setSelectedGame}
              onSeeAll={() => setActiveTab("library")}
            />
            <GameRow 
              title="Luta & Combate" 
              games={GAMES.filter(g => g.category === "Luta")} 
              onGameClick={setSelectedGame}
              onSeeAll={() => { setSearchQuery("Luta"); setActiveTab("search"); }}
            />
            <GameRow 
              title="Plataforma & Mundo" 
              games={GAMES.filter(g => g.category === "Plataforma" || g.category === "Aventura")} 
              onGameClick={setSelectedGame}
              onSeeAll={() => { setSearchQuery("Plataforma"); setActiveTab("search"); }}
            />
            <GameRow 
              title="Esportes & Diversão" 
              games={GAMES.filter(g => g.category === "Esportes" || g.category === "Simulação")} 
              onGameClick={setSelectedGame}
              onSeeAll={() => { setSearchQuery("Esportes"); setActiveTab("search"); }}
            />
            <GameRow 
              title="Biblioteca Extendida" 
              games={GAMES.filter(g => g.category === "Outros").slice(0, 100)} 
              onGameClick={setSelectedGame}
              onSeeAll={() => { setActiveTab("library"); }}
            />
            <GameRow 
              title="Clássicos do Sega Mega Drive" 
              games={GAMES.filter(g => g.category === "Sega Mega Drive" || g.system === "Mega Drive")} 
              onGameClick={setSelectedGame}
              onSeeAll={() => { setActiveTab("megadrive"); }}
            />
          </div>
        )}

        {/* PS1 View - Same pattern as Home but for PS1 */}
        {activeTab === "ps1" && !searchQuery && (
          <div className="space-y-12 pb-24 pt-4">
             <div className="px-4 md:px-8">
               <div className="h-40 md:h-64 rounded-2xl overflow-hidden relative shadow-2xl border border-glass-border">
                 <PexelsImage 
                    queryName="playstation controller neon"
                    category="Gaming"
                    orientation="landscape"
                    fallbackUrl="https://images.pexels.com/photos/1373114/pexels-photo-1373114.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Playstation"
                    className="w-full h-full object-cover opacity-60"
                 />
                 <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex items-center p-8 md:p-12">
                   <div>
                     <h1 className="text-3xl md:text-5xl font-extrabold mb-2 text-white">Playstation 1</h1>
                     <p className="text-text-dim text-sm md:text-lg max-w-lg">{t("ps1.desc")}</p>
                   </div>
                 </div>
               </div>
             </div>

             <div className="px-4 md:px-8">
              <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2">
                <Gamepad2 className="w-6 h-6 text-emerald-500" /> 
                Biblioteca PS1
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {livePS1Games.map((game) => (
                  <div key={game.id} className="group cursor-pointer" onClick={() => setSelectedGame(game)}>
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 border border-glass-border shadow-lg transition-all duration-300 group-hover:border-emerald-500/50 bg-black/50">
                      <PexelsImage 
                        queryName={game.title}
                        category={game.category}
                        orientation="portrait"
                        fallbackUrl={game.imageUrl} 
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <button className="bg-emerald-500 text-white p-2 rounded-full w-fit ml-auto shadow-[0_0_15px_rgba(16,185,129,0.6)]">
                          <Play className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] uppercase font-bold text-white border border-white/10">
                        PS1
                      </div>
                    </div>
                    <h3 className="font-semibold text-sm tracking-tight line-clamp-1 group-hover:text-white transition-colors">{game.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-text-dim uppercase font-bold">{game.category}</span>
                      {game.rating >= 4.7 && <span className="bg-emerald-500 text-[8px] text-white px-1 rounded-sm font-bold uppercase">TOP</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "snes" && !searchQuery && (
          <div className="space-y-12 pb-24 pt-4">
             <div className="px-4 md:px-8">
               <div className="h-40 md:h-64 rounded-2xl overflow-hidden relative shadow-2xl border border-glass-border">
                 <PexelsImage 
                    queryName="super nintendo console retro"
                    category="Gaming"
                    orientation="landscape"
                    fallbackUrl="https://images.pexels.com/photos/163077/mario-yoschi-figures-funny-163077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="SNES"
                    className="w-full h-full object-cover opacity-60"
                 />
                 <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex items-center p-8 md:p-12">
                   <div>
                     <h1 className="text-3xl md:text-5xl font-extrabold mb-2 text-white">{t("app.nintendo")}</h1>
                     <p className="text-text-dim text-sm md:text-lg max-w-lg">{t("snes.desc")}</p>
                   </div>
                 </div>
               </div>
             </div>

             <div className="px-4 md:px-8">
              <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2">
                <Gamepad2 className="w-6 h-6 text-xbox-green" /> 
                Biblioteca SNES
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {liveGames.filter(g => g.system === "SNES").map((game) => (
                  <div key={game.id} className="group cursor-pointer" onClick={() => setSelectedGame(game)}>
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 border border-glass-border shadow-lg transition-all duration-300 group-hover:border-xbox-green/50 bg-black/50">
                      <PexelsImage 
                        queryName={game.title}
                        category={game.category}
                        orientation="portrait"
                        fallbackUrl={game.imageUrl} 
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <button className="bg-xbox-green text-white p-2 rounded-full w-fit ml-auto shadow-[0_0_15px_rgba(16,124,16,0.6)]">
                          <Play className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] uppercase font-bold text-white border border-white/10">
                        {game.system || "SNES"}
                      </div>
                    </div>
                    <h3 className="font-semibold text-sm tracking-tight line-clamp-1 group-hover:text-white transition-colors">{game.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-text-dim uppercase font-bold">{game.category}</span>
                      {game.rating >= 4.7 && <span className="bg-xbox-green text-[8px] text-white px-1 rounded-sm font-bold uppercase">TOP</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "megadrive" && !searchQuery && (
          <div className="space-y-12 pb-24 pt-4">
             <div className="px-4 md:px-8">
               <div className="h-40 md:h-64 rounded-2xl overflow-hidden relative shadow-2xl border border-glass-border">
                 <PexelsImage 
                    queryName="sega genesis mega drive console retro"
                    category="Gaming"
                    orientation="landscape"
                    fallbackUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Sega-Mega-Drive-JP-Mk1-Console-Set.png/800px-Sega-Mega-Drive-JP-Mk1-Console-Set.png"
                    alt="Mega Drive"
                    className="w-full h-full object-cover opacity-60"
                 />
                 <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex items-center p-8 md:p-12">
                   <div>
                     <h1 className="text-3xl md:text-5xl font-extrabold mb-2 text-white">Sega Mega Drive</h1>
                     <p className="text-text-dim text-sm md:text-lg max-w-lg">{t("mega.desc")}</p>
                   </div>
                 </div>
               </div>
             </div>

             <div className="px-4 md:px-8">
              <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2">
                <Gamepad2 className="w-6 h-6 text-xbox-green" /> 
                Biblioteca Mega Drive
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {liveGames.filter(g => g.system === "Mega Drive").map((game) => (
                  <div key={game.id} className="group cursor-pointer" onClick={() => setSelectedGame(game)}>
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 border border-glass-border shadow-lg transition-all duration-300 group-hover:border-xbox-green/50 bg-black/50">
                      <PexelsImage 
                        queryName={game.title}
                        category={game.category}
                        orientation="portrait"
                        fallbackUrl={game.imageUrl} 
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <button className="bg-xbox-green text-white p-2 rounded-full w-fit ml-auto shadow-[0_0_15px_rgba(16,124,16,0.6)]">
                          <Play className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] uppercase font-bold text-white border border-white/10">
                        {game.system || "Mega Drive"}
                      </div>
                    </div>
                    <h3 className="font-semibold text-sm tracking-tight line-clamp-1 group-hover:text-white transition-colors">{game.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-text-dim uppercase font-bold">{game.category}</span>
                      {game.rating >= 4.7 && <span className="bg-xbox-green text-[8px] text-white px-1 rounded-sm font-bold uppercase">TOP</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Library & Search Grid */}
        {(activeTab === "library" || activeTab === "search" || searchQuery) && activeTab !== "profile" && activeTab !== "ps1" && activeTab !== "snes" && activeTab !== "megadrive" && (
          <div className="px-4 md:px-8 py-6 pb-24">
            <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-xbox-green" /> 
              {searchQuery ? `Resultados para "${searchQuery}"` : "Todos os Jogos na Biblioteca"}
            </h2>
            
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {filteredGames.map((game) => (
                  <div key={game.id} className="group cursor-pointer" onClick={() => setSelectedGame(game)}>
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 border border-glass-border shadow-lg transition-all duration-300 group-hover:border-xbox-green/50 bg-black/50">
                      <PexelsImage 
                        queryName={game.title}
                        category={game.category}
                        orientation="portrait"
                        fallbackUrl={game.imageUrl} 
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <button className="bg-xbox-green text-white p-2 rounded-full w-fit ml-auto shadow-[0_0_15px_rgba(16,124,16,0.6)]">
                          <Play className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] uppercase font-bold text-white border border-white/10">
                        {game.system || "SNES"}
                      </div>
                    </div>
                    <h3 className="font-semibold text-sm tracking-tight line-clamp-1 group-hover:text-white transition-colors">{game.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-text-dim uppercase font-bold">{game.category}</span>
                      {game.rating >= 4.9 && <span className="bg-xbox-green text-[8px] text-white px-1 rounded-sm font-bold uppercase">TOP</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center px-8 w-full">
                <div className="bg-white/5 p-6 rounded-full mb-6">
                  <Search className="w-12 h-12 text-white/20" />
                </div>
                <h2 className="text-2xl font-bold mb-2">{t("search.not_found")}</h2>
                <p className="text-white/50 max-w-md">{t("search.not_found_desc").replace('{searchQuery}', searchQuery)}</p>
                <button 
                  onClick={() => { setSearchQuery(""); setActiveTab("library"); }}
                  className="mt-6 text-xbox-green font-bold hover:underline"
                >
                  Limpar busca
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-6 mb-24 py-6 text-center text-white/30 text-[11px] font-medium border-t border-white/5 flex flex-col sm:flex-row gap-2 sm:gap-6 justify-center items-center">
          <span>Wonder Games Cloud © {new Date().getFullYear()}</span>
          <span className="hidden sm:inline text-white/10">•</span>
          <span>
            Desenvolvedor:{" "}
            <a 
              href="https://portfolio-braian-three.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/60 hover:text-xbox-green font-bold underline underline-offset-4 transition-all duration-300"
              id="footer-developer-link"
            >
              Braian Kmdc
            </a>
          </span>
        </footer>
      </main>

      {/* Game Details Overlay */}
      <AnimatePresence>
        {selectedGame && !isPlaying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-black/90 backdrop-blur-2xl"
          >
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-xbox-gray-card w-full h-full md:h-auto md:max-w-5xl md:rounded-3xl overflow-hidden relative shadow-2xl border-t md:border border-white/10"
            >
              <button 
                onClick={() => setSelectedGame(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full bg-black/40 hover:bg-white/10 transition-all z-50 border border-white/10"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <div className="flex flex-col md:flex-row h-full max-h-screen md:max-h-[90vh] overflow-y-auto md:overflow-hidden">
                <div className="w-full md:w-2/5 aspect-video md:aspect-[3/4] relative group/cover cursor-pointer flex-shrink-0" onClick={() => { setActiveJoinCode(undefined); setIsPlaying(true); }}>
                  <PexelsImage 
                    queryName={selectedGame.title}
                    category={selectedGame.category}
                    orientation="portrait"
                    fallbackUrl={selectedGame.imageUrl} 
                    alt={selectedGame.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/cover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-xbox-green p-4 md:p-6 rounded-full shadow-[0_0_30px_rgba(16,124,16,0.5)] transform hover:scale-110 transition-transform duration-300">
                      <Play className="w-8 h-8 md:w-10 md:h-10 fill-current" />
                    </div>
                  </div>
                </div>
                <div className="p-6 md:p-12 flex-1 flex flex-col glass border-none !bg-transparent backdrop-blur-none md:overflow-y-auto custom-scrollbar">
                  <span className="text-xbox-green font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1 md:mb-2">{selectedGame.category}</span>
                  <h2 className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-6 tracking-tight leading-tight">{selectedGame.title}</h2>
                  
                  <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8 text-text-dim text-xs md:text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white font-bold">{selectedGame.rating}</span>
                    </div>
                    <span>•</span>
                    <span className="px-1.5 py-0.5 border border-white/20 rounded text-[9px] md:text-[10px]">{selectedGame.system === 'PS1' ? '32-BIT CLASSIC' : '16-BIT CLASSIC'}</span>
                  </div>

                  <p className="text-text-dim leading-relaxed mb-8 md:mb-auto text-sm md:text-lg">
                    {selectedGame.description}
                  </p>
                  
                  
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6 mt-4">
                    <h3 className="text-white font-bold mb-2 text-sm flex items-center gap-2"><Gamepad2 className="w-4 h-4 text-xbox-green" /> Multiplayer Local</h3>
                    <p className="text-text-dim text-xs">Conecte vários controles USB ou Bluetooth. O emulador reconhecerá automaticamente o Player 1 e Player 2.</p>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6">
                    <h3 className="text-white font-bold mb-2 text-sm flex items-center gap-2"><Cloud className="w-4 h-4 text-blue-400" /> Multiplayer Online (Netplay)</h3>
                    <p className="text-text-dim text-xs mb-3">
                      {selectedGame.system === 'Mega Drive' 
                         ? 'Para hospedar, inicie o jogo, e clique em "Netplay" na barra inferior para gerar um código/link. Para entrar no jogo de um amigo, cole o código ou link abaixo:'
                         : 'Para hospedar ou entrar, inicie o jogo, abra o Menu do Emulador e selecione Netplay. Ou use o código abaixo se suportado:'}
                    </p>
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
                  
                  <div className="grid grid-cols-2 gap-4 mb-8 text-[10px] md:text-xs">

                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                      <p className="text-xbox-green uppercase tracking-tighter mb-1 font-bold">{t("game.developer")}</p>
                      <p className="text-white font-medium">{selectedGame.system === 'PS1' ? 'Sony / Third Party' : selectedGame.system === 'Mega Drive' ? 'Sega / Third Party' : 'Nintendo / Third Party'}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                      <p className="text-xbox-green uppercase tracking-tighter mb-1 font-bold">{t("game.platform")}</p>
                      <p className="text-white font-medium">{selectedGame.system === 'PS1' ? t("app.playstation") : selectedGame.system === 'Mega Drive' ? t("app.sega") : t("app.nintendo")}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 mt-auto md:mt-8 sticky bottom-0 bg-xbox-bg md:bg-xbox-gray-card/80 backdrop-blur-md pt-4 pb-4 md:pb-2">
                    <button 
                      onClick={() => setIsPlaying(true)}
                      className="w-full sm:w-auto bg-xbox-green hover:brightness-110 px-8 md:px-12 py-3 md:py-4 rounded-md font-bold text-sm md:text-lg flex items-center justify-center gap-2 md:gap-3 transition-all active:scale-95 shadow-xl shadow-xbox-green/40 uppercase tracking-widest ring-4 ring-xbox-green/20"
                    >
                      <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" /> {t("game.start")}
                    </button>
                    {user && (
                      <button 
                        onClick={() => handleSaveProgress(selectedGame)}
                        disabled={savingRecord}
                        className={`w-full sm:w-auto hover:bg-white/10 px-6 md:px-8 py-3 md:py-4 rounded-md font-bold text-[10px] md:text-xs transition-all uppercase tracking-widest flex items-center justify-center gap-2 border border-white/20 ${savingRecord ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Cloud className="w-4 h-4 fill-current" /> {savingRecord ? 'Salvando...' : 'Salvar Cloud'}
                      </button>
                    )}
                    <button 
                      onClick={() => setSelectedGame(null)}
                      className="w-full sm:w-auto glass hover:bg-white/10 px-6 md:px-8 py-3 md:py-4 rounded-md font-bold text-[10px] md:text-xs transition-all uppercase tracking-widest"
                    >
                      Voltar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invitations Notification Overlay */}
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

      {/* Game Player */}
      <AnimatePresence>
        {isPlaying && selectedGame && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col"
          >
            <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between bg-zinc-900 border-b border-white/5">
              <div className="flex items-center gap-3 md:gap-4">
                <Gamepad2 className="w-5 h-5 md:w-6 md:h-6 text-xbox-green" />
                <div className="min-w-0">
                  <h3 className="text-xs md:text-sm font-bold leading-none truncate">{selectedGame.title}</h3>
                  <span className="text-[8px] md:text-[10px] text-white/40 uppercase font-black tracking-widest truncate">{t("game.cloud_session")}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-all hidden sm:block"><Maximize2 className="w-5 h-5" /></button>
                {user && (
                   <button 
                     onClick={() => handleSaveProgress(selectedGame)}
                     disabled={savingRecord}
                     className={`bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-all flex items-center gap-2 px-3 md:px-4 font-bold text-[10px] md:text-xs ${savingRecord ? 'opacity-50 cursor-not-allowed' : ''}`}
                   >
                     <Cloud className="w-4 h-4 md:w-5 md:h-5" /> <span className="hidden sm:inline">{savingRecord ? 'Salvando...' : t("game.save_cloud")}</span><span className="sm:hidden">{t("game.btn_save")}</span>
                   </button>
                )}
                <button 
                  onClick={() => setIsPlaying(false)}
                  className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-lg transition-all flex items-center gap-2 px-3 md:px-4 italic font-bold text-[10px] md:text-xs"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" /> <span className="hidden sm:inline">{t("game.end_session")}</span><span className="sm:hidden">{t("game.exit")}</span>
                </button>
              </div>
            </div>
            
            {/* ALGORITMO LIMPO: return 0; // State Reset Successful */}
            <div className="flex-1 bg-black relative flex items-center justify-center pointer-events-auto">
              {selectedGame.playUrl ? (
                <>
                <CloudPlayer 
                  playUrl={selectedGame.playUrl} 
                  title={`Cloud Session: ${selectedGame.title}`} 
                  iframeRef={iframeRef as any}
                  joinCode={activeJoinCode}
                />
                {activeJoinCode && (
                  <ChatComponent sessionId={activeJoinCode} />
                )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center bg-black w-full h-full">
                  <Gamepad2 className="w-16 h-16 text-white/20 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{t("game.rom_not_connected")}</h3>
                  <p className="text-white/50 text-sm max-w-md">
                    Devido aos direitos autorais da Nintendo, as ROMs da biblioteca estendida do SNES ainda não estão conectadas a um emulador de nuvem compatível.
                  </p>
                </div>
              )}
            </div>

            <div className="p-3 md:p-4 bg-zinc-900 border-t border-white/5 flex justify-center gap-8 md:gap-12 text-[8px] md:text-[10px] uppercase font-bold text-white/40 tracking-[0.2em] md:tracking-[0.3em] overflow-x-auto no-scrollbar whitespace-nowrap">
              <span>{gamepadConnected ? t("game.controls_auto") : t("game.controls_manual")}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick?: () => void }) {  return (    <button       onClick={onClick}      className={`relative p-3 rounded-2xl transition-all group flex flex-col items-center gap-1 flex-shrink-0 ${active ? "bg-white/10 text-xbox-green shadow-[0_0_15px_rgba(16,124,16,0.3)]" : "text-text-dim hover:text-white hover:bg-white/5"}`}    >
      <Icon className={`w-5 h-5 md:w-6 md:h-6 ${active ? "stroke-[3px]" : "stroke-[2px]"}`} />
      <span className="text-[10px] font-bold uppercase tracking-tighter md:hidden">{label}</span>
      {active && (
        <motion.div 
          layoutId="activeIndicator"
          className="absolute -left-4 hidden md:block w-1 h-8 bg-xbox-green rounded-r-full shadow-[0_0_10px_rgba(16,124,16,0.8)]"
        />
      )}
      <div className="absolute left-[calc(100%+12px)] px-3 py-1 glass text-[10px] font-bold uppercase tracking-widest rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all hidden md:block whitespace-nowrap z-50">
        {label}
      </div>
    </button>
  );
}

function GameRow({ title, games, onGameClick, onSeeAll }: { title: string, games: Game[], onGameClick: (g: Game) => void, onSeeAll?: () => void }) {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (games.length === 0) return null;

  return (
    <section className="px-4 md:px-8 flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base md:text-lg font-semibold tracking-tight text-white flex items-center justify-between w-full">
          {title}
          {onSeeAll && (
            <span onClick={onSeeAll} className="text-xbox-green text-[10px] md:text-xs font-bold uppercase tracking-wider cursor-pointer hover:underline underline-offset-4 decoration-2">{t("app.see_all")}</span>
          )}
        </h2>
        <div className="hidden md:flex gap-2 ml-4">
          <button 
            onClick={() => scrollRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}
            className="p-1 px-3 rounded-md glass hover:bg-white/10 transition-all text-xs font-bold"
          >
            ←
          </button>
          <button 
            onClick={() => scrollRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}
            className="p-1 px-3 rounded-md glass hover:bg-white/10 transition-all text-xs font-bold"
          >
            →
          </button>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar"
      >
        {games.map((game) => (
          <motion.div
            key={game.id}
            whileHover={{ y: -8 }}
            onClick={() => onGameClick(game)}
            className="flex-shrink-0 w-40 md:w-52 group cursor-pointer"
          >
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 border border-glass-border shadow-lg transition-all duration-300 group-hover:border-xbox-green/50 bg-black/50">
              <PexelsImage 
                queryName={game.title}
                category={game.category}
                orientation="portrait"
                fallbackUrl={game.imageUrl} 
                alt={game.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                 <button className="bg-xbox-green text-white p-2 rounded-full w-fit ml-auto shadow-[0_0_15px_rgba(16,124,16,0.6)]">
                   <Play className="w-4 h-4 fill-current" />
                 </button>
              </div>
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] uppercase font-bold text-white border border-white/10">
                {game.system || "SNES"}
              </div>
            </div>
            <h3 className="font-semibold text-sm tracking-tight line-clamp-1 group-hover:text-white transition-colors">{game.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-text-dim uppercase font-bold">{game.category}</span>
              {game.rating >= 4.9 && <span className="bg-xbox-green text-[8px] text-white px-1 rounded-sm font-bold uppercase">TOP</span>}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
