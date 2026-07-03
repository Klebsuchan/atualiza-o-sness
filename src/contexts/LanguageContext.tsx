import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  pt: {
    // Landing Page
    'nav.catalogo': 'Catálogo',
    'nav.sistemas': 'Sistemas',
    'nav.sobre': 'Sobre',
    'nav.entrar': 'Entrar',
    'nav.jogar_agora': 'Jogar Agora',
    
    'hero.title1': 'Reviva os',
    'hero.title2': 'Anos Dourados.',
    'hero.subtitle': 'Uma plataforma em nuvem elegante com a biblioteca definitiva de Super Nintendo, Sega Mega Drive e PlayStation 1. Salve seu progresso e jogue de qualquer lugar.',
    
    'sobre.title': 'Como Funciona',
    'sobre.card1.title': '1. Escolha',
    'sobre.card1.desc': 'Navegue pelo nosso catálogo com milhares de clássicos.',
    'sobre.card2.title': '2. Jogue',
    'sobre.card2.desc': 'Inicie instantaneamente no seu navegador sem instalar nada.',
    'sobre.card3.title': '3. Salve',
    'sobre.card3.desc': 'Seu progresso é salvo na nuvem. Continue de onde parou.',
    
    'catalogo.title': 'Clássicos Inesquecíveis',
    'catalogo.subtitle': 'Os maiores sucessos da era de ouro dos videogames estão aqui, prontos para serem jogados diretamente do seu navegador.',
    'catalogo.covers.title': 'Sobre as Capas dos Jogos',
    'catalogo.covers.desc': 'Por questões de direitos autorais e políticas do Google, algumas capas originais de jogos não puderam ser exibidas. Mas não se preocupe, o jogo em si está intacto e pronto para ser jogado!',
    
    'sistemas.title': 'Sistemas Suportados',
    'sistemas.snes.desc': 'A era de ouro dos 16-bits. Jogue clássicos como Super Mario World, Zelda e Donkey Kong Country.',
    'sistemas.genesis.desc': 'O console que trouxe jogos mais rápidos e maduros. Reviva Sonic, Streets of Rage e muito mais.',
    'sistemas.ps1.desc': 'A revolução 3D. Experimente a magia de Final Fantasy VII, Crash Bandicoot e Metal Gear Solid.',
    
    'footer.desc': 'Reviva a era de ouro dos videogames. Sua plataforma definitiva para jogar clássicos do SNES, Mega Drive e PS1 diretamente do navegador com salvamento em nuvem.',
    'footer.links': 'Links Rápidos',
    'footer.legal': 'Legal',
    'footer.terms': 'Termos de Serviço',
    'footer.privacy': 'Política de Privacidade',
    'footer.copyright': 'Feito com paixão pelos retro games.',
    
    // App
    'app.search': 'Buscar jogos...',
    'app.home': 'Início',
    'app.nintendo': 'Super Nintendo',
    'app.sega': 'Mega Drive',
    'app.playstation': 'PlayStation 1',
    'app.profile': 'Perfil',
    
    'app.featured': 'Em Destaque',
    'app.play': 'Jogar',
    
    'app.continue': 'Continuar Jogando',
    'app.catalog': 'Catálogo Completo',
    
    'profile.title': 'Seu Perfil Retro',
    'profile.login_prompt': 'Faça login para salvar seu progresso na nuvem, ganhar XP e muito mais!',
    'profile.login_btn': 'Entrar com Google',
    'profile.stats': 'Estatísticas',
    'profile.days_played': 'Dias Jogados',
    'profile.xp': 'Experiência',
    'profile.level': 'Nível',
    'profile.saved_games': 'Jogos Salvos',
    'profile.logout': 'Sair da Conta',
    
    'game.save_progress': 'SALVAR NA NUVEM',
    'game.saving': 'SALVANDO...',
    'game.end_session': 'ENCERRAR SESSÃO',
    'game.exit': 'SAIR',
    'game.start': 'INICIAR GAMEPLAY'
  },
  en: {
    // Landing Page
    'nav.catalogo': 'Catalog',
    'nav.sistemas': 'Systems',
    'nav.sobre': 'About',
    'nav.entrar': 'Sign In',
    'nav.jogar_agora': 'Play Now',
    
    'hero.title1': 'Relive the',
    'hero.title2': 'Golden Years.',
    'hero.subtitle': 'An elegant cloud platform with the definitive library of Super Nintendo, Sega Genesis, and PlayStation 1. Save your progress and play from anywhere.',
    
    'sobre.title': 'How It Works',
    'sobre.card1.title': '1. Choose',
    'sobre.card1.desc': 'Browse our catalog with thousands of classics.',
    'sobre.card2.title': '2. Play',
    'sobre.card2.desc': 'Start instantly in your browser without installing anything.',
    'sobre.card3.title': '3. Save',
    'sobre.card3.desc': 'Your progress is saved in the cloud. Pick up where you left off.',
    
    'catalogo.title': 'Unforgettable Classics',
    'catalogo.subtitle': 'The biggest hits from the golden era of video games are here, ready to be played directly from your browser.',
    'catalogo.covers.title': 'About Game Covers',
    'catalogo.covers.desc': 'Due to copyright issues and Google policies, some original game covers could not be displayed. But don\'t worry, the game itself is intact and ready to be played!',
    
    'sistemas.title': 'Supported Systems',
    'sistemas.snes.desc': 'The 16-bit golden era. Play classics like Super Mario World, Zelda, and Donkey Kong Country.',
    'sistemas.genesis.desc': 'The console that brought faster, mature games. Relive Sonic, Streets of Rage, and more.',
    'sistemas.ps1.desc': 'The 3D revolution. Experience the magic of Final Fantasy VII, Crash Bandicoot, and Metal Gear Solid.',
    
    'footer.desc': 'Relive the golden era of video games. Your definitive platform to play SNES, Genesis, and PS1 classics directly from the browser with cloud saving.',
    'footer.links': 'Quick Links',
    'footer.legal': 'Legal',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.copyright': 'Made with passion for retro games.',
    
    // App
    'app.search': 'Search games...',
    'app.home': 'Home',
    'app.nintendo': 'Super Nintendo',
    'app.sega': 'Sega Genesis',
    'app.playstation': 'PlayStation 1',
    'app.profile': 'Profile',
    
    'app.featured': 'Featured',
    'app.play': 'Play',
    
    'app.continue': 'Continue Playing',
    'app.catalog': 'Full Catalog',
    
    'profile.title': 'Your Retro Profile',
    'profile.login_prompt': 'Log in to save your progress in the cloud, earn XP, and more!',
    'profile.login_btn': 'Sign In with Google',
    'profile.stats': 'Statistics',
    'profile.days_played': 'Days Played',
    'profile.xp': 'Experience',
    'profile.level': 'Level',
    'profile.saved_games': 'Saved Games',
    'profile.logout': 'Sign Out',
    
    'game.save_progress': 'SAVE TO CLOUD',
    'game.saving': 'SAVING...',
    'game.end_session': 'END SESSION',
    'game.exit': 'EXIT',
    'game.start': 'START GAMEPLAY'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: string): string => {
    return (translations as any)[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
