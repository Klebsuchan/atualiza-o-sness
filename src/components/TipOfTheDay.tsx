import { useState, useEffect, useMemo } from "react";
import { Game } from "../data/games";
import { Lightbulb, Play } from "lucide-react";

export function TipOfTheDay({ games, onPlayGame }: { games: Game[], onPlayGame: (game: Game) => void }) {
  const [tipGame, setTipGame] = useState<Game | null>(null);
  
  // Create a predictable random index based on the current date, so it's a "Tip of the Day"
  const randomTip = useMemo(() => {
    const motivationalTips = [
      "Que tal dar uma pausa e reviver essa lenda?",
      "Um clássico nunca morre. É hora de revisitar esse mundo!",
      "Prepare-se para horas de diversão garantida.",
      "A nostalgia bateu forte? Aventure-se nesse título imperdível.",
      "Se você nunca jogou, essa é a sua chance de conhecer uma obra-prima."
    ];
    return motivationalTips[Math.floor(Math.random() * motivationalTips.length)];
  }, []);

  useEffect(() => {
    if (games.length > 0) {
      // Pick a random game based on the current day to keep it consistent for the day
      const today = new Date();
      const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
      const randomIdx = seed % games.length;
      setTipGame(games[randomIdx]);
    }
  }, [games]);

  if (!tipGame) return null;

  return (
    <div className="mx-4 md:mx-8 mb-12 bg-gradient-to-r from-xbox-green/10 to-transparent border border-xbox-green/20 rounded-2xl p-6 md:p-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-xbox-green/5 blur-[80px] rounded-full pointer-events-none -z-10 group-hover:bg-xbox-green/10 transition-all duration-700"></div>
      
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center relative z-10">
        <div className="flex-1 order-2 md:order-1">
          <div className="flex items-center gap-2 text-xbox-green mb-3 uppercase tracking-widest font-bold text-xs">
            <Lightbulb className="w-5 h-5 fill-current" />
            <span>Dica do Dia</span>
          </div>
          <h3 className="text-2xl md:text-4xl font-black text-white mb-3 tracking-tight">{tipGame.title}</h3>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-4 line-clamp-3">
            {tipGame.description || `Um clássico inesquecível da categoria ${tipGame.category}.`}
          </p>
          <div className="bg-black/40 border border-white/5 rounded-xl p-4 mb-6">
            <p className="text-xbox-green/90 italic text-sm md:text-base font-medium">
              "{randomTip}"
            </p>
          </div>
          <button 
            onClick={() => onPlayGame(tipGame)}
            className="bg-xbox-green hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs md:text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,124,16,0.3)] hover:shadow-[0_0_25px_rgba(16,124,16,0.5)] w-full md:w-auto"
          >
            <Play className="w-5 h-5 fill-current" />
            Jogar Agora
          </button>
        </div>
        <div className="w-full md:w-5/12 aspect-video md:aspect-[16/10] rounded-xl overflow-hidden shadow-2xl border border-white/10 relative order-1 md:order-2 group-hover:scale-[1.02] transition-transform duration-500">
          <img 
            src={tipGame.bannerUrl || tipGame.imageUrl} 
            alt={tipGame.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  );
}
