import { useState } from "react";
import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import { Gamepad2, Cloud, Heart, Copy, CheckCircle2, Play, ChevronDown, Zap, User } from "lucide-react";

const PixelHeart = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 11 10" className={`pixel-outline ${className}`} xmlns="http://www.w3.org/2000/svg" style={{ shapeRendering: 'crispEdges' }}>
    <path d="M2,0 h2 v1 h-2 z M7,0 h2 v1 h-2 z M1,1 h4 v1 h-4 z M6,1 h4 v1 h-4 z M0,2 h11 v1 h-11 z M0,3 h11 v1 h-11 z M0,4 h11 v1 h-11 z M1,5 h9 v1 h-9 z M2,6 h7 v1 h-7 z M3,7 h5 v1 h-5 z M4,8 h3 v1 h-3 z M5,9 h1 v1 h-1 z" fill="#e52521" />
  </svg>
);

const PixelStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 11 11" className={`pixel-outline ${className}`} xmlns="http://www.w3.org/2000/svg" style={{ shapeRendering: 'crispEdges' }}>
    <path d="M5,0 h1 v3 h-1 z M4,3 h3 v1 h-3 z M0,4 h11 v1 h-11 z M1,5 h9 v1 h-9 z M2,6 h7 v1 h-7 z M3,7 h5 v1 h-5 z M2,8 h2 v1 h-2 z M7,8 h2 v1 h-2 z M1,9 h2 v1 h-2 z M8,9 h2 v1 h-2 z" fill="#FFD700" />
  </svg>
);

const PixelCoin = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 8 10" className={`pixel-outline ${className}`} xmlns="http://www.w3.org/2000/svg" style={{ shapeRendering: 'crispEdges' }}>
    <path d="M2,0 h4 v1 h-4 z M1,1 h6 v1 h-6 z M0,2 h8 v6 h-8 z M1,8 h6 v1 h-6 z M2,9 h4 v1 h-4 z" fill="#FFD700" />
    <path d="M2,2 h1 v6 h-1 z" fill="#FFF280" />
    <path d="M5,2 h1 v6 h-1 z" fill="#B8860B" />
  </svg>
);

const RedButton = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 12" className={`pixel-outline ${className}`} xmlns="http://www.w3.org/2000/svg" style={{ shapeRendering: 'crispEdges' }}>
    <path d="M4,0 h8 v1 h-8 z M2,1 h12 v1 h-12 z M1,2 h14 v5 h-14 z M0,7 h16 v2 h-16 z M1,9 h14 v2 h-14 z M2,11 h12 v1 h-12 z" fill="#a0a0a0" />
    <path d="M5,1 h6 v1 h-6 z M3,2 h10 v2 h-10 z M2,4 h12 v3 h-12 z" fill="#e52521" />
    <path d="M4,3 h3 v1 h-3 z M3,4 h2 v1 h-2 z" fill="#ff7070" />
  </svg>
);

export function LandingPage({ onEnter }: { onEnter: () => void }) {
  const { t, language, setLanguage } = useLanguage();
  const [copied, setCopied] = useState(false);
  const pixKey = "b0f51ae0-be9f-4b87-9da4-0ca63dd8ccbb";

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[100dvh] bg-[#050505] text-white flex flex-col font-sans overflow-y-auto no-scrollbar relative">
      <style>
        {`
          .pixel-outline {
            filter: drop-shadow(2px 0 0 #000) drop-shadow(-2px 0 0 #000) drop-shadow(0 2px 0 #000) drop-shadow(0 -2px 0 #000);
          }
        `}
      </style>
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-emerald-900/30 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute top-[40%] right-[20%] w-96 h-96 bg-purple-900/20 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[10%] left-[50%] w-[40rem] h-[20rem] bg-xbox-green/10 blur-[150px] rounded-full mix-blend-screen -translate-x-1/2"></div>
        
        {/* Consoles Background */}
        <motion.img 
          initial={{ y: 0, rotate: -12 }}
          animate={{ y: [-15, 15, -15], rotate: [-12, -15, -12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Nintendo-Super-Famicom-Set-FL.jpg" className="absolute top-[-5%] left-[-15%] w-[400px] md:w-[600px] opacity-20 mix-blend-lighten" alt="SNES" />
        <motion.img 
          initial={{ y: 0, rotate: 12 }}
          animate={{ y: [15, -15, 15], rotate: [12, 15, 12] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          src="https://upload.wikimedia.org/wikipedia/commons/a/a1/Sega-Mega-Drive-JP-Mk1-Console-Set.jpg" className="absolute top-[-5%] right-[-15%] w-[400px] md:w-[600px] opacity-20 mix-blend-lighten" alt="Mega Drive" />
        <motion.img 
          initial={{ y: 0, rotate: -6 }}
          animate={{ y: [-10, 10, -10], rotate: [-6, -3, -6] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          src="https://upload.wikimedia.org/wikipedia/commons/9/95/PSX-Console-wController.jpg" className="absolute bottom-[5%] right-[-10%] w-[350px] md:w-[500px] opacity-20 mix-blend-lighten" alt="PS1" />
        <motion.img 
          initial={{ y: 0, rotate: 6 }}
          animate={{ y: [10, -10, 10], rotate: [6, 9, 6] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Nintendo-Super-Famicom-Set-FL.jpg" className="absolute bottom-[-10%] left-[-10%] w-[300px] md:w-[450px] opacity-20 mix-blend-lighten" alt="SNES" />

        {/* Floating Pixels */}
        <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[18%] left-[8%] transform -rotate-12">
          <PixelHeart className="w-10 h-10 md:w-16 md:h-16" />
        </motion.div>
        <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute top-[15%] left-[15%] transform rotate-12 opacity-80">
          <PixelHeart className="w-6 h-6 md:w-10 md:h-10" />
        </motion.div>
        
        <motion.div animate={{ y: [-8, 8, -8] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-[28%] left-[12%] transform rotate-12">
          <PixelStar className="w-12 h-12 md:w-20 md:h-20" />
        </motion.div>
        
        <motion.div animate={{ y: [8, -8, 8] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} className="absolute top-[32%] right-[8%] transform -rotate-12">
          <PixelCoin className="w-10 h-12 md:w-14 md:h-16" />
        </motion.div>
        <motion.div animate={{ y: [-6, 6, -6] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute top-[28%] right-[14%] transform rotate-6 opacity-90">
          <PixelCoin className="w-8 h-10 md:w-10 md:h-12" />
        </motion.div>
        
        <motion.div animate={{ y: [10, -10, 10] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} className="absolute bottom-[35%] right-[10%] transform -rotate-6">
          <PixelStar className="w-10 h-10 md:w-16 md:h-16" />
        </motion.div>
        <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }} className="absolute bottom-[20%] right-[15%] transform rotate-12">
          <PixelHeart className="w-8 h-8 md:w-12 md:h-12" />
        </motion.div>
        
        <motion.div animate={{ y: [6, -6, 6] }} transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 2.2 }} className="absolute bottom-[25%] left-[12%] transform -rotate-12">
          <RedButton className="w-16 h-12 md:w-24 md:h-16" />
        </motion.div>
        <motion.div animate={{ y: [-8, 8, -8] }} transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 1.8 }} className="absolute bottom-[20%] left-[8%] transform rotate-6">
          <PixelStar className="w-10 h-10 md:w-16 md:h-16" />
        </motion.div>
        <motion.div animate={{ y: [7, -7, 7] }} transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 2.5 }} className="absolute bottom-[30%] left-[18%] transform -rotate-12">
          <PixelCoin className="w-8 h-10 md:w-10 md:h-12" />
        </motion.div>
        
        <motion.div animate={{ y: [-6, 6, -6] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} className="absolute bottom-[5%] left-[30%] transform -rotate-6">
          <PixelHeart className="w-8 h-8 md:w-14 md:h-14" />
        </motion.div>
        <motion.div animate={{ y: [9, -9, 9] }} transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 1.1 }} className="absolute bottom-[10%] right-[30%] transform rotate-12">
          <PixelCoin className="w-8 h-10 md:w-12 md:h-14" />
        </motion.div>
      </div>

      {/* Header */}
      <header className="relative z-50 flex items-center justify-between px-6 py-4 md:px-12 bg-black/40 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3 text-emerald-500">
          <img src="/logo.png" alt="Wonder Games Cloud" className="w-12 h-12 object-contain" />
          <span className="text-xl font-bold tracking-tight text-white">Wonder<span className="text-[#15b045]">Games</span></span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
          <button onClick={() => setLanguage(language === "pt" ? "en" : "pt")} className="flex items-center gap-1 hover:text-white transition-colors bg-white/5 px-2 py-1 rounded-md text-xs font-bold border border-white/10 uppercase">{language}</button>
          <a href="#catalogo" onClick={(e) => { e.preventDefault(); document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#15b045] transition-colors">{t("nav.catalogo")}</a>
          <a href="#sistemas" onClick={(e) => { e.preventDefault(); document.getElementById('sistemas')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#15b045] transition-colors">{t("nav.sistemas")}</a>
          <a href="#sobre" onClick={(e) => { e.preventDefault(); document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#15b045] transition-colors">{t("nav.sobre")}</a>
        </nav>
        <div className="flex items-center gap-4">
          <button onClick={onEnter} className="hidden sm:flex items-center gap-2 text-sm font-bold text-white hover:text-[#15b045] transition-colors">
            <User className="w-4 h-4" /> {t("nav.entrar")}
          </button>
          <button onClick={onEnter} className="bg-[#15b045] hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(21,176,69,0.3)]">
            Jogar Agora
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col px-4 sm:px-6 text-center z-10 relative">
        <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden flex items-center justify-center">
          <motion.video 
            src="/videooooooo.mp4" 
            autoPlay 
            muted 
            loop 
            playsInline
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full object-cover mix-blend-screen contrast-150 brightness-110 saturate-200" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/20 to-[#050505]"></div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center py-12 md:py-24 relative">
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl relative z-10"
        >
          <h1 className="text-5xl sm:text-7xl md:text-[5rem] lg:text-[6rem] font-black tracking-tighter mb-4 md:mb-6 leading-[1.1]">
            {t("hero.title1")} <br />
            <span className="text-[#15b045]">
              {t("hero.title2")}
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-zinc-300 mb-10 md:mb-12 max-w-2xl mx-auto font-medium leading-relaxed px-4">
            {t("hero.subtitle")}
          </p>
           <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500/80 p-4 rounded-xl max-w-2xl mx-auto mb-12 text-sm text-left flex items-start gap-3"><Zap className="w-5 h-5 flex-shrink-0 mt-0.5" /><div><strong className="block mb-1">{t("catalogo.covers.title")}</strong>{t("catalogo.covers.desc")}</div></div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEnter}
            className="bg-[#15b045] text-white px-8 md:px-10 py-4 md:py-5 rounded-xl font-black text-sm md:text-lg uppercase tracking-[0.15em] flex items-center justify-center gap-3 w-full sm:w-auto mx-auto transition-all hover:bg-emerald-600 shadow-[0_0_20px_rgba(21,176,69,0.4)] hover:shadow-[0_0_40px_rgba(21,176,69,0.6)]"
          >
            <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" />
            ENTRAR NA PLATAFORMA
          </motion.button>
        </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="flex flex-col items-center gap-2 text-zinc-500 animate-bounce pb-6 shrink-0"
        >
          <span className="text-[10px] uppercase font-bold tracking-widest">{t("nav.saiba_mais")}</span>
          <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
        </motion.div>
      </main>

      {/* {t("sobre.title")} */}
      <section id="sobre" className="py-16 md:py-24 bg-zinc-950 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-12">{t("sobre.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center glass p-8 rounded-2xl relative">
               <div className="w-12 h-12 bg-xbox-green text-white rounded-full flex items-center justify-center text-xl font-bold absolute -top-6 left-1/2 -translate-x-1/2 shadow-lg">1</div>
               <h3 className="text-xl font-bold mt-4 mb-2">{t("sobre.card1.title")}</h3>
               <p className="text-zinc-400">{t("sobre.card1.desc")}</p>
            </div>
            <div className="text-center glass p-8 rounded-2xl relative">
               <div className="w-12 h-12 bg-xbox-green text-white rounded-full flex items-center justify-center text-xl font-bold absolute -top-6 left-1/2 -translate-x-1/2 shadow-lg">2</div>
               <h3 className="text-xl font-bold mt-4 mb-2">{t("sobre.card2.title")}</h3>
               <p className="text-zinc-400">{t("sobre.card2.desc")}</p>
            </div>
            <div className="text-center glass p-8 rounded-2xl relative">
               <div className="w-12 h-12 bg-xbox-green text-white rounded-full flex items-center justify-center text-xl font-bold absolute -top-6 left-1/2 -translate-x-1/2 shadow-lg">3</div>
               <h3 className="text-xl font-bold mt-4 mb-2">{t("sobre.card3.title")}</h3>
               <p className="text-zinc-400">{t("sobre.card3.desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vitrine */}
      <section id="catalogo" className="py-16 md:py-24 bg-black px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center">
           <h2 className="text-3xl md:text-5xl font-black mb-4">{t("catalogo.title")}</h2>
           <p className="text-zinc-400 max-w-2xl mx-auto mb-12">{t("catalogo.subtitle")}</p>
           
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { title: "Super Mario World", img: "https://i.987967.xyz/screenshot/79/2023/06/22/44986_e36127d41a0f19ff4b09e693761086a198e05e81.png" },
                { title: "Sonic the Hedgehog", img: "https://upload.wikimedia.org/wikipedia/en/b/ba/Sonic_the_Hedgehog_1_Genesis_box_art.jpg" },
                { title: "Crash Bandicoot", img: "https://i.987967.xyz/screenshot/72/2023/07/12/40129_2363be9aa67351a0edfe876487b12015d262b154.png" },
                { title: "Donkey Kong Country", img: "https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Super_Nintendo_Entertainment_System/master/Named_Boxarts/Donkey%20Kong%20Country%20(USA).png" },
              ].map((game, i) => (
                <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden group border border-white/10">
                  <img src={game.img} alt={game.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4 md:p-6">
                    <h3 className="text-white font-bold text-sm md:text-lg">{game.title}</h3>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Gamification */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-zinc-900 to-black px-4 sm:px-6 border-t border-xbox-green/20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-xbox-green/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
           <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-xbox-green/10 text-xbox-green text-xs font-bold uppercase tracking-widest mb-6 border border-xbox-green/20">
                <Zap className="w-4 h-4 fill-current" /> Novo Sistema de Progressão
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-6">{t("features.level_up.title1")} <br className="hidden md:block"/>{t("features.level_up.title2")}</h2>
              <p className="text-zinc-400 text-lg md:text-xl leading-relaxed mb-8">
                Jogue todos os dias, ganhe XP e suba de nível no seu perfil retro! Desbloqueie conquistas, acompanhe seus dias jogados e construa seu legado na plataforma.
              </p>
              <button onClick={onEnter} className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors mx-auto md:mx-0">
                 Criar meu Perfil
              </button>
           </div>
           <div className="flex-1 w-full max-w-md">
              <div className="glass p-8 rounded-3xl border border-xbox-green/30 relative shadow-[0_0_50px_rgba(16,124,16,0.15)]">
                 <div className="absolute -top-4 -right-4 w-12 h-12 bg-xbox-green text-black font-black flex items-center justify-center rounded-full text-xl shadow-[0_0_20px_rgba(16,124,16,0.5)] transform rotate-12">
                   LVL<br/>5
                 </div>
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-xbox-green flex items-center justify-center">
                       <User className="w-8 h-8 text-zinc-500" />
                    </div>
                    <div>
                       <h4 className="font-bold text-lg">{t("features.classic_player")}</h4>
                       <p className="text-xs text-xbox-green font-bold uppercase tracking-widest">{t("features.connected_account")}</p>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div>
                       <div className="flex justify-between text-xs font-bold uppercase text-zinc-400 mb-2">
                         <span>{t("features.experience")}</span>
                         <span className="text-xbox-green">2150 / 2500 XP</span>
                       </div>
                       <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                         <div className="h-full bg-gradient-to-r from-emerald-600 to-xbox-green w-[86%]"></div>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="flex-1 bg-black/40 p-3 rounded-xl text-center border border-white/5">
                          <p className="text-2xl font-black text-white">14</p>
                          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{t("features.days_played")}</p>
                       </div>
                       <div className="flex-1 bg-black/40 p-3 rounded-xl text-center border border-white/5">
                          <p className="text-2xl font-black text-white">8</p>
                          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{t("features.saved_games")}</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Features */}
      <section id="sistemas" className="py-16 md:py-24 bg-zinc-950 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          <div className="flex flex-col items-center text-center md:items-start md:text-left gap-3 md:gap-4 glass md:border-none p-6 md:p-0 rounded-2xl md:bg-transparent">
            <div className="bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl w-fit">
              <Cloud className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white">{t("benefits.save_state")}</h3>
            <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
              Vincule sua conta Google e mantenha o progresso das suas fases armazenado em nossos servidores para continuar de outro PC.
            </p>
          </div>
          <div className="flex flex-col items-center text-center md:items-start md:text-left gap-3 md:gap-4 glass md:border-none p-6 md:p-0 rounded-2xl md:bg-transparent">
            <div className="bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl w-fit">
              <Gamepad2 className="w-6 h-6 md:w-8 md:h-8 text-xbox-green" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white">{t("benefits.native_controls")}</h3>
            <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
              Suporte plug-and-play para Xbox, PlayStation ou joysticks genéricos USB/Bluetooth com mapeamento automático de botões.
            </p>
          </div>
          <div className="flex flex-col items-center text-center md:items-start md:text-left gap-3 md:gap-4 glass md:border-none p-6 md:p-0 rounded-2xl md:bg-transparent">
            <div className="bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl w-fit">
              <Zap className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white">{t("benefits.fluid_performance")}</h3>
            <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
              Emulação WebAssembly sem engasgos com visuais de alta definição e um design minimalista para priorizar sua gameplay.
            </p>
          </div>
          <div className="flex flex-col items-center text-center md:items-start md:text-left gap-3 md:gap-4 glass md:border-none p-6 md:p-0 rounded-2xl md:bg-transparent">
            <div className="bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl w-fit">
              <Gamepad2 className="w-6 h-6 md:w-8 md:h-8 text-pink-400" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white">{t("benefits.multi_platform")}</h3>
            <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
              {t("benefits.desc")}
            </p>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 md:py-24 bg-zinc-950 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center">
           <h2 className="text-3xl md:text-5xl font-black mb-12">{t("community.title")}</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: t("community.t1.name"), text: t("community.t1.text") },
                { name: t("community.t2.name"), text: t("community.t2.text") },
                { name: t("community.t3.name"), text: t("community.t3.text") }
              ].map((dep, i) => (
                <div key={i} className="glass p-6 rounded-2xl text-left relative">
                  <div className="text-xbox-green mb-4">
                    <svg className="w-8 h-8 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/></svg>
                  </div>
                  <p className="text-zinc-300 mb-6 italic">"{dep.text}"</p>
                  <p className="font-bold text-sm text-white">{dep.name}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-black px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
           <h2 className="text-3xl md:text-5xl font-black text-center mb-12">{t("faq.title")}</h2>
           <div className="space-y-6">
              {[
                { q: t("faq.q1"), a: t("faq.a1") },
                { q: t("faq.q2"), a: t("faq.a2") },
                { q: t("faq.q3"), a: t("faq.a3") },
                { q: t("faq.q4"), a: t("faq.a4") }
              ].map((faq, i) => (
                <div key={i} className="glass p-6 md:p-8 rounded-2xl border border-white/5">
                   <h3 className="text-lg md:text-xl font-bold text-white mb-3">{faq.q}</h3>
                   <p className="text-zinc-400 text-sm md:text-base leading-relaxed">{faq.a}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 md:py-32 bg-zinc-950 px-4 sm:px-6 border-t border-white/5 text-center">
        <div className="max-w-3xl mx-auto">
           <h2 className="text-4xl md:text-6xl font-black mb-6">{t("cta.title")}</h2>
           <p className="text-zinc-400 text-lg md:text-xl mb-10">{t("cta.desc")}</p>
           <button onClick={onEnter} className="bg-xbox-green hover:bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black text-lg md:text-xl uppercase tracking-widest shadow-[0_0_30px_rgba(16,124,16,0.5)] flex items-center justify-center gap-3 transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(16,124,16,0.7)] mx-auto">
             <Play className="w-6 h-6 fill-current" />
             Começar a Jogar Agora
           </button>
        </div>
      </section>

      {/* Donation */}
      <section className="py-16 md:py-24 px-4 sm:px-6 bg-gradient-to-t from-zinc-950 to-black relative border-t border-xbox-green/10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-white/5 border border-white/10 p-6 sm:p-8 md:p-12 rounded-[2rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-xbox-green/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="flex-1 text-center md:text-left z-10 flex flex-col items-center md:items-start w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-widest mb-4 md:mb-6 border border-red-500/20">
              <Heart className="w-3 h-3 md:w-4 md:h-4 fill-current" /> Apoie a Plataforma
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 md:mb-4 tracking-tight">{t("donate.title")}</h2>
            <p className="text-sm sm:text-base text-zinc-400 mb-6 md:mb-8 leading-relaxed md:text-lg">
              O <strong>Wonder Games Cloud</strong> é um espaço feito de fãs para fãs. 
              Tudo aqui tem um custo mensal considerável com provedores, armazenamento de dados e largura de banda na nuvem.
              <br /><br />
              {t("donate.desc")}<strong>{t("donate.desc_bold")}</strong>{t("donate.desc2")}
            </p>
            
            <div className="flex flex-col items-center md:items-start gap-3 md:gap-4 w-full">
              <span className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest">{t("donate.pix_key")}</span>
              <div className="flex items-center gap-2 bg-black/50 border border-white/10 p-1.5 pl-3 md:p-2 md:pl-4 rounded-xl w-full max-w-sm">
                <code className="text-xs sm:text-sm text-xbox-green font-mono truncate flex-1">{pixKey}</code>
                <button 
                  onClick={handleCopy}
                  className="bg-white/10 hover:bg-white/20 p-2 md:p-2.5 rounded-lg transition-colors flex-shrink-0"
                  title="Copiar Chave"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" /> : <Copy className="w-4 h-4 md:w-5 md:h-5 text-white" />}
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-3 md:gap-4 z-10 shrink-0 mt-4 md:mt-0">
            <div className="p-3 md:p-4 bg-white rounded-2xl shadow-2xl">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixKey)}`} 
                alt="QR Code do PIX" 
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-lg"
              />
            </div>
            <span className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
               Escaneie o QR Code
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black pt-16 pb-8 border-t border-white/10 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-1/2 bg-xbox-green/5 blur-[100px] pointer-events-none rounded-t-full"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-xbox-green rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,124,16,0.5)]">
                  <Gamepad2 className="w-6 h-6 text-black" />
                </div>
                <span className="text-xl font-black tracking-tight text-white">Wonder Games<span className="text-xbox-green">Cloud</span></span>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                {t("footer.desc")}
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">{t("footer.nav")}</h4>
              <ul className="space-y-3">
                <li><button onClick={onEnter} className="text-zinc-400 hover:text-xbox-green transition-colors text-sm">{t("footer.enter_platform")}</button></li>
                <li><a href="#" className="text-zinc-400 hover:text-xbox-green transition-colors text-sm">{t("footer.game_catalog")}</a></li>
                <li><a href="#" className="text-zinc-400 hover:text-xbox-green transition-colors text-sm">{t("sistemas.title")}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">{t("footer.legal")}</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">{t("footer.terms_of_use")}</a></li>
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">{t("footer.privacy")}</a></li>
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">{t("footer.copyright_notice")}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 gap-4 text-center md:text-left">
            <p className="text-zinc-500 text-xs font-medium">
              Wonder Games Cloud © {new Date().getFullYear()}. {t("footer.copyright")}
            </p>
            <p className="text-zinc-500 text-xs font-medium">
              Desenvolvido por{" "}
              <a 
                href="https://portfolio-braian-three.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-xbox-green font-bold transition-all duration-300"
              >
                Braian Kmdc
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
