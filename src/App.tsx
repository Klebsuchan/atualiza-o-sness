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
import { ps1Games } from "./data/ps1Games";
import { useAuth } from "./contexts/AuthContext";
import { db } from "./lib/firebase";
import { collection, query, getDocs, doc, setDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { useGamepad } from "./hooks/useGamepad";
import { LandingPage } from "./components/LandingPage";

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
  const [hasEntered, setHasEntered] = useState(false);
  const [isLoadingGames, setIsLoadingGames] = useState(true);
  const [liveGames, setLiveGames] = useState<Game[]>([]);
  const [livePS1Games, setLivePS1Games] = useState<Game[]>([]);
  const { user, loginWithGoogle, logout, loading, error } = useAuth();
  
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [featuredGame, setFeaturedGame] = useState<Game>(GAMES[0]);
  const [savedGames, setSavedGames] = useState<any[]>([]);
  const [savingRecord, setSavingRecord] = useState(false);
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
    }
  }, [user, activeTab]);

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
      alert("Faça login no Perfil para salvar seu progresso na nuvem!");
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
           <h2 className="text-xl font-black italic tracking-tighter">SINCRONIZANDO REPOSITÓRIOS...</h2>
           <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.3em]">Carregando Biblioteca Real</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] overflow-hidden bg-xbox-bg text-white">
      {/* Sidebar Rail (Tablet & PC) / Bottom Nav (Mobile) */}
      <nav className="w-full min-h-[calc(4rem+env(safe-area-inset-bottom,0px))] md:min-h-0 md:h-full md:w-20 order-last md:order-first flex md:flex-col items-center justify-around md:justify-start py-0 md:py-8 border-t md:border-t-0 md:border-r border-white/5 bg-black/40 backdrop-blur-2xl z-50 pb-[env(safe-area-inset-bottom,0px)]">
        <div className="hidden md:block mb-12">
          <Gamepad2 className="w-8 h-8 text-xbox-green" />
        </div>
        
        <div className="flex md:flex-col gap-6 md:gap-8 items-center justify-around w-full md:w-auto">
          <NavItem icon={Home} label="Home" active={activeTab === "home"} onClick={() => setActiveTab("home")} />
          <NavItem icon={Library} label="Biblioteca" active={activeTab === "library"} onClick={() => setActiveTab("library")} />
          <NavItem icon={Radio} label="PS1" active={activeTab === "ps1"} onClick={() => setActiveTab("ps1")} />
          <NavItem icon={Search} label="Buscar" active={activeTab === "search"} onClick={() => setActiveTab("search")} />
          <div className="hidden md:block">
            <NavItem icon={User} label="Perfil" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
          </div>
          
          <div className="md:hidden">
             <div 
                className="w-8 h-8 rounded-full bg-gradient-to-br from-xbox-green to-emerald-800 border-2 border-white/20 overflow-hidden cursor-pointer flex-shrink-0"
                onClick={() => user ? setActiveTab("profile") : loginWithGoogle()}
             >
               <img src={user?.photoURL || "https://ui-avatars.com/api/?name=Guest&background=107C10&color=fff"} alt="Profile" referrerPolicy="no-referrer" />
             </div>
          </div>
        </div>

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
                placeholder="Buscar jogos do Super Nintendo..." 
                value={searchQuery}
                onChange={(e) => {setSearchQuery(e.target.value); setActiveTab("search");}}
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-text-dim"
              />
            </div>
            <div className="hidden md:flex items-center gap-6">
              {gamepadConnected && (
                <div className="hidden md:flex items-center gap-2 bg-xbox-green/20 border border-xbox-green/50 px-3 py-1.5 rounded-full text-xbox-green">
                  <Gamepad2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Controle Conectado</span>
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
                    <span className="bg-xbox-green px-1.5 md:px-2 py-0.5 rounded text-[8px] md:text-[10px] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(16,124,16,0.5)]">SNES Classic</span>
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
                      <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" /> Jogar
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
                <h2 className="text-2xl font-bold mb-2">Conta não conectada</h2>
                <p className="text-text-dim mb-6 max-w-md">Faça login com o Google para salvar o seu progresso na Nuvem em qualquer jogo, visualizar seu histórico, e manter um backup seguro online sincronizado.</p>
                <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                  <button 
                    onClick={loginWithGoogle}
                    className="bg-xbox-green hover:brightness-110 px-8 py-3 rounded-md font-bold flex items-center justify-center gap-2 transition-all uppercase tracking-widest shadow-[0_0_15px_rgba(16,124,16,0.3)] w-full"
                  >
                    <Cloud className="w-5 h-5 fill-current" /> Entrar com Google
                  </button>
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-md text-xs text-left w-full">
                      <strong>Erro:</strong> {error}
                      {error.includes('bloqueado') && (
                         <div className="mt-2 pt-2 border-t border-red-500/20">
                           <p>Para contornar, você pode abrir este app em uma <strong>nova janela</strong>:</p>
                           <button onClick={() => window.open(window.location.href, '_blank')} className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded uppercase tracking-wider font-bold w-full">↗️ Abrir em Nova Janela</button>
                         </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6 glass p-6 md:p-8 rounded-2xl">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-xbox-green shadow-[0_0_20px_rgba(16,124,16,0.5)] overflow-hidden">
                      <img src={user.photoURL || "https://ui-avatars.com/api/?name=Guest&background=107C10&color=fff"} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
                  <button 
                    onClick={logout}
                    className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-5 py-2.5 rounded-md font-bold text-xs uppercase tracking-widest transition-all"
                  >
                    <LogOut className="w-4 h-4" /> Sair
                  </button>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                    <Gamepad2 className="w-6 h-6 text-xbox-green" /> Jogos Salvos ({savedGames.length})
                  </h3>
                  {savedGames.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {savedGames.map((sg) => (
                        <div key={sg.id} className="group cursor-pointer" onClick={() => {
                          const found = [...GAMES, ...ps1Games].find(g => g.id === sg.gameId);
                           if (found) setSelectedGame(found);
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
                            <div className="absolute top-2 right-2 bg-xbox-green text-white px-2 py-0.5 rounded text-[8px] uppercase font-bold shadow-lg">Salvo</div>
                          </div>
                          <h4 className="font-semibold text-xs tracking-tight line-clamp-1">{sg.title}</h4>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 glass rounded-xl border border-white/5">
                      <p className="text-text-dim">Você ainda não tem jogos salvos na nuvem.</p>
                      <p className="text-xs text-white/40 mt-2">Abra um jogo e clique em "Salvar Progresso" para sincronizá-lo aqui.</p>
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
              title="Biblioteca Extendida SNES" 
              games={GAMES.filter(g => g.category === "Outros").slice(0, 100)} 
              onGameClick={setSelectedGame}
              onSeeAll={() => { setActiveTab("library"); }}
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
                     <p className="text-text-dim text-sm md:text-lg max-w-lg">Reviva a era de ouro dos jogos 3D. Selecione um jogo abaixo e comece a jogar imediatamente no navegador.</p>
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

        {/* Library & Search Grid */}
        {(activeTab === "library" || activeTab === "search" || searchQuery) && activeTab !== "profile" && activeTab !== "ps1" && (
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
                <h2 className="text-2xl font-bold mb-2">Nenhum jogo encontrado</h2>
                <p className="text-white/50 max-w-md">Não encontramos resultados para "{searchQuery}". Tente usar palavras-chave diferentes.</p>
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
                <div className="w-full md:w-2/5 aspect-video md:aspect-[3/4] relative group/cover cursor-pointer flex-shrink-0" onClick={() => setIsPlaying(true)}>
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
                    <span className="px-1.5 py-0.5 border border-white/20 rounded text-[9px] md:text-[10px]">16-BIT CLASSIC</span>
                  </div>

                  <p className="text-text-dim leading-relaxed mb-8 md:mb-auto text-sm md:text-lg">
                    {selectedGame.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8 text-[10px] md:text-xs">
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                      <p className="text-xbox-green uppercase tracking-tighter mb-1 font-bold">Desenvolvedora</p>
                      <p className="text-white font-medium">{selectedGame.system === 'PS1' ? 'Sony / Third Party' : 'Nintendo / Third Party'}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                      <p className="text-xbox-green uppercase tracking-tighter mb-1 font-bold">Plataforma</p>
                      <p className="text-white font-medium">{selectedGame.system === 'PS1' ? 'Playstation 1' : 'Super Nintendo'}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 mt-auto md:mt-8 sticky bottom-0 bg-xbox-bg md:bg-xbox-gray-card/80 backdrop-blur-md pt-4 pb-4 md:pb-2">
                    <button 
                      onClick={() => setIsPlaying(true)}
                      className="w-full sm:w-auto bg-xbox-green hover:brightness-110 px-8 md:px-12 py-3 md:py-4 rounded-md font-bold text-sm md:text-lg flex items-center justify-center gap-2 md:gap-3 transition-all active:scale-95 shadow-xl shadow-xbox-green/40 uppercase tracking-widest ring-4 ring-xbox-green/20"
                    >
                      <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" /> INICIAR GAMEPLAY
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
                  <span className="text-[8px] md:text-[10px] text-white/40 uppercase font-black tracking-widest truncate">Sessão de Nuvem Ativa</span>
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
                     <Cloud className="w-4 h-4 md:w-5 md:h-5" /> <span className="hidden sm:inline">{savingRecord ? 'Salvando...' : 'Salvar na Cloud'}</span><span className="sm:hidden">SALVAR</span>
                   </button>
                )}
                <button 
                  onClick={() => setIsPlaying(false)}
                  className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-lg transition-all flex items-center gap-2 px-3 md:px-4 italic font-bold text-[10px] md:text-xs"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" /> <span className="hidden sm:inline">ENCERRAR SESSÃO</span><span className="sm:hidden">SAIR</span>
                </button>
              </div>
            </div>
            
            {/* ALGORITMO LIMPO: return 0; // State Reset Successful */}
            <div className="flex-1 bg-black relative flex items-center justify-center pointer-events-auto">
              {selectedGame.playUrl ? (
                <iframe 
                  ref={iframeRef}
                  key={`${selectedGame.id}-${Date.now()}`}
                  src={`${selectedGame.playUrl}?nocache=${Date.now()}`}
                  className="w-full h-full border-none shadow-2xl"
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-modals"
                  onLoad={() => {
                    iframeRef.current?.focus();
                  }}
                  title={`Cloud Session: ${selectedGame.title}`}
                ></iframe>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center bg-black w-full h-full">
                  <Gamepad2 className="w-16 h-16 text-white/20 mb-4" />
                  <h3 className="text-xl font-bold mb-2">ROM não conectada</h3>
                  <p className="text-white/50 text-sm max-w-md">
                    Devido aos direitos autorais da Nintendo, as ROMs da biblioteca estendida do SNES ainda não estão conectadas a um emulador de nuvem compatível.
                  </p>
                </div>
              )}
            </div>

            <div className="p-3 md:p-4 bg-zinc-900 border-t border-white/5 flex justify-center gap-8 md:gap-12 text-[8px] md:text-[10px] uppercase font-bold text-white/40 tracking-[0.2em] md:tracking-[0.3em] overflow-x-auto no-scrollbar whitespace-nowrap">
              <span>{gamepadConnected ? "🎮 CONTROLE AUTO-DETECTADO • PADRÃO SUPER NINTENDO (A CONFIRMA, B VOLTA)" : "CONTROLES: SETAS = MOVER • X/S = A/B • D/C = X/Y • ENTER = START • SHIFT = SELECT" }</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`relative p-3 rounded-2xl transition-all group flex flex-col items-center gap-1 ${active ? "bg-white/10 text-xbox-green shadow-[0_0_15px_rgba(16,124,16,0.3)]" : "text-text-dim hover:text-white hover:bg-white/5"}`}
    >
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
  const scrollRef = useRef<HTMLDivElement>(null);

  if (games.length === 0) return null;

  return (
    <section className="px-4 md:px-8 flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base md:text-lg font-semibold tracking-tight text-white flex items-center justify-between w-full">
          {title}
          {onSeeAll && (
            <span onClick={onSeeAll} className="text-xbox-green text-[10px] md:text-xs font-bold uppercase tracking-wider cursor-pointer hover:underline underline-offset-4 decoration-2">Ver todos</span>
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
