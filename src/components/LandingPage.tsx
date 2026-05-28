import { useState } from "react";
import { motion } from "motion/react";
import { Gamepad2, Cloud, Heart, Copy, CheckCircle2, Play, ChevronDown, Zap, Camera } from "lucide-react";

export function LandingPage({ onEnter }: { onEnter: () => void }) {
  const [copied, setCopied] = useState(false);
  const pixKey = "b0f51ae0-be9f-4b87-9da4-0ca63dd8ccbb";

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[100dvh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black text-white flex flex-col font-sans overflow-y-auto no-scrollbar">
      {/* Header */}
      <header className="p-6 md:px-12 flex items-center justify-between z-50">
        <div className="flex items-center gap-3 text-xbox-green">
          <Gamepad2 className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight text-white">Wonder<span className="text-xbox-green">Snes</span></span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col px-4 sm:px-6 text-center z-10 relative">
        <div className="flex-1 flex flex-col items-center justify-center py-12 md:py-20">
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:py-1 rounded-full bg-xbox-green/10 border border-xbox-green/20 text-xbox-green text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6 md:mb-8 text-center leading-tight">
            <Zap className="w-3 h-3 md:w-4 md:h-4 shrink-0" /> Agora com suporte nativo a Gamepads
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-4 md:mb-6 leading-tight">
            Reviva os <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-xbox-green to-emerald-400">
              Anos Dourados.
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-2xl text-zinc-400 mb-8 md:mb-10 max-w-2xl mx-auto font-medium leading-relaxed px-2">
            Uma plataforma em nuvem elegante com a biblioteca definitiva do Super Nintendo. Salve seu progresso online e jogue de qualquer lugar.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEnter}
            className="bg-xbox-green text-white px-8 md:px-10 py-4 md:py-5 rounded-xl font-black text-base md:text-xl uppercase tracking-widest shadow-[0_0_30px_rgba(16,124,16,0.5)] flex items-center justify-center gap-3 w-full sm:w-auto mx-auto transition-all hover:bg-emerald-600 hover:shadow-[0_0_50px_rgba(16,124,16,0.7)]"
          >
            <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" />
            Entrar na Plataforma
          </motion.button>
        </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="flex flex-col items-center gap-2 text-zinc-500 animate-bounce pb-6 shrink-0"
        >
          <span className="text-[10px] uppercase font-bold tracking-widest">Saiba Mais</span>
          <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
        </motion.div>
      </main>

      {/* Features */}
      <section className="py-16 md:py-24 bg-zinc-950 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          <div className="flex flex-col items-center text-center md:items-start md:text-left gap-3 md:gap-4 glass md:border-none p-6 md:p-0 rounded-2xl md:bg-transparent">
            <div className="bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl w-fit">
              <Cloud className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white">Save State na Nuvem</h3>
            <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
              Vincule sua conta Google e mantenha o progresso das suas fases armazenado em nossos servidores para continuar de outro PC.
            </p>
          </div>
          <div className="flex flex-col items-center text-center md:items-start md:text-left gap-3 md:gap-4 glass md:border-none p-6 md:p-0 rounded-2xl md:bg-transparent">
            <div className="bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl w-fit">
              <Gamepad2 className="w-6 h-6 md:w-8 md:h-8 text-xbox-green" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white">Controles Nativos</h3>
            <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
              Suporte plug-and-play para Xbox, PlayStation ou joysticks genéricos USB/Bluetooth com mapeamento automático de botões.
            </p>
          </div>
          <div className="flex flex-col items-center text-center md:items-start md:text-left gap-3 md:gap-4 glass md:border-none p-6 md:p-0 rounded-2xl md:bg-transparent">
            <div className="bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl w-fit">
              <Zap className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white">Performace Fluida</h3>
            <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
              Emulação WebAssembly sem engasgos com visuais de alta definição e um design minimalista para priorizar sua gameplay.
            </p>
          </div>
          <div className="flex flex-col items-center text-center md:items-start md:text-left gap-3 md:gap-4 glass md:border-none p-6 md:p-0 rounded-2xl md:bg-transparent">
            <div className="bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl w-fit">
              <Camera className="w-6 h-6 md:w-8 md:h-8 text-pink-400" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white">Galerias Alternativas</h3>
            <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
              Respeitando as políticas rígidas de Direitos Autorais do Google Cloud, não hospedamos capas diretas dos jogos. Usamos imagens fotográficas nostálgicas equivalentes (Pexels).
            </p>
          </div>
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 md:mb-4 tracking-tight">Ajude a manter a Plataforma no ar!</h2>
            <p className="text-sm sm:text-base text-zinc-400 mb-6 md:mb-8 leading-relaxed md:text-lg">
              O <strong>WonderSnes Cloud</strong> é um espaço feito de fãs para fãs. 
              Tudo aqui tem um custo mensal considerável com provedores, armazenamento de dados e largura de banda na nuvem.
              <br /><br />
              Para garantir que o projeto cumpra a missão de conectar gerações com a nostalgia sempre online e receba cada vez mais melhorias, <strong>qualquer contribuição via PIX é incrivelmente valiosa</strong>. Faça parte do suporte desta jornada!
            </p>
            
            <div className="flex flex-col items-center md:items-start gap-3 md:gap-4 w-full">
              <span className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest">Chave PIX Aleatória</span>
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
      <footer className="py-8 text-center text-zinc-600 text-xs font-medium border-t border-white/10">
        <p>WonderSnes Cloud © {new Date().getFullYear()}. Feito com paixão pelos retro games.</p>
      </footer>
    </div>
  );
}
