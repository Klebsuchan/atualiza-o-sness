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

    'nav.saiba_mais': 'Saiba Mais',

    'loading.sync': 'SINCRONIZANDO REPOSITÓRIOS...',
    'loading.real_lib': 'Carregando Biblioteca Real',
    'app.controller_connected': 'Controle Conectado',
    'auth.not_connected': 'Conta não conectada',
    'auth.login_reason': 'Faça login com o Google para salvar o seu progresso na Nuvem em qualquer jogo, visualizar seu histórico, e manter um backup seguro online sincronizado.',
    'error.title': 'Erro:',
    'error.open_new_window': 'Para contornar, você pode abrir este app em uma',
    'error.new_window_link': 'nova janela',
    'error.btn_new_window': '↗️ Abrir em Nova Janela',
    'profile.saved': 'Salvo',
    'profile.no_saves': 'Você ainda não tem jogos salvos na nuvem.',
    'profile.no_saves_desc': 'Abra um jogo e clique em "Salvar Progresso" para sincronizá-lo aqui.',
    'ps1.desc': 'Reviva a era de ouro dos jogos 3D. Selecione um jogo abaixo e comece a jogar imediatamente no navegador.',
    'snes.desc': 'A era de ouro dos 16-bits. Clássicos inesquecíveis.',
    'mega.desc': 'Velocidade e atitude. Reviva a era da Sega.',
    'search.not_found': 'Nenhum jogo encontrado',
    'search.not_found_desc': 'Não encontramos resultados para "{searchQuery}". Tente usar palavras-chave diferentes.',
    'game.developer': 'Desenvolvedora',
    'game.platform': 'Plataforma',
    'game.cloud_session': 'Sessão de Nuvem Ativa',
    'game.save_cloud': 'Salvar na Cloud',
    'game.btn_save': 'SALVAR',
    'game.rom_not_connected': 'ROM não conectada',
    'game.controls_auto': '🎮 CONTROLE AUTO-DETECTADO • PADRÃO SUPER NINTENDO (A CONFIRMA, B VOLTA)',
    'game.controls_manual': 'CONTROLES: SETAS = MOVER • X/S = A/B • D/C = X/Y • ENTER = START • SHIFT = SELECT',
    'app.see_all': 'Ver todos',

    
    'features.level_up.title1': 'Suba de Nível',
    'features.level_up.title2': 'Jogando',
    'features.classic_player': 'Jogador Clássico',
    'features.connected_account': 'Conta Conectada',
    'features.experience': 'Experiência',
    'features.days_played': 'Dias Jogados',
    'features.saved_games': 'Jogos Salvos',
    
    'benefits.save_state': 'Save State na Nuvem',
    'benefits.native_controls': 'Controles Nativos',
    'benefits.fluid_performance': 'Performace Fluida',
    'benefits.multi_platform': 'Múltiplas Plataformas',
    'benefits.desc': 'Desfrute de milhares de títulos inesquecíveis do Super Nintendo (SNES), da velocidade do Sega Mega Drive e dos clássicos em 3D do PlayStation 1.',
    
    'community.title': 'O que a comunidade diz',

    'community.t1.text': 'Finalmente posso jogar meus RPGs de SNES no intervalo do trabalho e continuar do celular em casa. O cloud save é perfeito!',
    'community.t1.name': 'Lucas M.',
    'community.t2.text': 'A interface é muito fluida e jogar PS1 no navegador sem instalar nada é mágico. Recomendo muito!',
    'community.t2.name': 'Mariana R.',
    'community.t3.text': 'Conectei meu controle de Xbox via Bluetooth e o mapeamento foi automático. A melhor plataforma retro que já usei.',
    'community.t3.name': 'Thiago K.',

    
    'faq.title': 'Perguntas Frequentes',
    'faq.q1': 'Preciso baixar ou instalar algum emulador?',
    'faq.a1': 'Não. A Wonder Games Cloud funciona 100% no seu navegador usando tecnologia WebAssembly. Basta acessar e jogar.',
    'faq.q2': 'O salvamento em nuvem é gratuito?',
    'faq.a2': 'Sim! Ao conectar com sua conta Google, seu progresso é salvo automaticamente em nossos servidores de forma segura.',
    'faq.q3': 'Posso jogar usando um controle?',
    'faq.a3': 'Com certeza. Suportamos a maioria dos controles USB e Bluetooth, como de Xbox e PlayStation. O mapeamento é feito automaticamente na maioria dos casos.',
    'faq.q4': 'Funciona no celular?',
    'faq.a4': 'Sim, a plataforma é responsiva e possui controles virtuais na tela para você jogar no smartphone de forma confortável.',
    
    'cta.title': 'Pronto para a Nostalgia?',
    'cta.desc': 'Junte-se à comunidade e tenha seus clássicos favoritos sempre ao alcance de um clique.',
    
    'donate.title': 'Ajude a manter a Plataforma no ar!',
    'donate.desc': 'Para garantir que o projeto cumpra a missão de conectar gerações com a nostalgia sempre online e receba cada vez mais melhorias, ',
    'donate.desc_bold': 'qualquer contribuição via PIX é incrivelmente valiosa',
    'donate.desc2': '. Faça parte do suporte desta jornada!',
    'donate.pix_key': 'Chave PIX Aleatória',
    
    'footer.nav': 'Navegação',
    'footer.enter_platform': 'Entrar na Plataforma',
    'footer.game_catalog': 'Catálogo de Jogos',
    'footer.terms_of_use': 'Termos de Uso',
    'footer.copyright_notice': 'Aviso de Direitos Autorais',

    
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

    'nav.saiba_mais': 'Learn More',

    'loading.sync': 'SYNCHRONIZING REPOSITORIES...',
    'loading.real_lib': 'Loading Real Library',
    'app.controller_connected': 'Controller Connected',
    'auth.not_connected': 'Account not connected',
    'auth.login_reason': 'Sign in with Google to save your cloud progress in any game, view your history, and keep a secure online backup synchronized.',
    'error.title': 'Error:',
    'error.open_new_window': 'To bypass this, you can open this app in a',
    'error.new_window_link': 'new window',
    'error.btn_new_window': '↗️ Open in New Window',
    'profile.saved': 'Saved',
    'profile.no_saves': 'You do not have any games saved in the cloud yet.',
    'profile.no_saves_desc': 'Open a game and click "Save Progress" to sync it here.',
    'ps1.desc': 'Relive the golden era of 3D games. Select a game below and start playing immediately in the browser.',
    'snes.desc': 'The 16-bit golden era. Unforgettable classics.',
    'mega.desc': 'Speed and attitude. Relive the Sega era.',
    'search.not_found': 'No games found',
    'search.not_found_desc': 'We did not find results for "{searchQuery}". Try using different keywords.',
    'game.developer': 'Developer',
    'game.platform': 'Platform',
    'game.cloud_session': 'Active Cloud Session',
    'game.save_cloud': 'Save to Cloud',
    'game.btn_save': 'SAVE',
    'game.rom_not_connected': 'ROM not connected',
    'game.controls_auto': '🎮 CONTROLLER AUTO-DETECTED • SUPER NINTENDO STANDARD (A CONFIRM, B BACK)',
    'game.controls_manual': 'CONTROLS: ARROWS = MOVE • X/S = A/B • D/C = X/Y • ENTER = START • SHIFT = SELECT',
    'app.see_all': 'See all',

    
    'features.level_up.title1': 'Level Up',
    'features.level_up.title2': 'By Playing',
    'features.classic_player': 'Classic Player',
    'features.connected_account': 'Connected Account',
    'features.experience': 'Experience',
    'features.days_played': 'Days Played',
    'features.saved_games': 'Saved Games',
    
    'benefits.save_state': 'Cloud Save State',
    'benefits.native_controls': 'Native Controls',
    'benefits.fluid_performance': 'Fluid Performance',
    'benefits.multi_platform': 'Multiple Platforms',
    'benefits.desc': 'Enjoy thousands of unforgettable Super Nintendo (SNES) titles, the speed of Sega Genesis, and the 3D classics of PlayStation 1.',
    
    'community.title': 'What the community says',

    'community.t1.text': 'Finally I can play my SNES RPGs during my work break and continue on my phone at home. Cloud save is perfect!',
    'community.t1.name': 'Lucas M.',
    'community.t2.text': 'The interface is very fluid and playing PS1 in the browser without installing anything is magical. Highly recommended!',
    'community.t2.name': 'Mariana R.',
    'community.t3.text': 'I connected my Xbox controller via Bluetooth and mapping was automatic. The best retro platform I have ever used.',
    'community.t3.name': 'Thiago K.',

    
    'faq.title': 'Frequently Asked Questions',
    'faq.q1': 'Do I need to download or install an emulator?',
    'faq.a1': 'No. Wonder Games Cloud works 100% in your browser using WebAssembly technology. Just access and play.',
    'faq.q2': 'Is cloud saving free?',
    'faq.a2': 'Yes! By connecting with your Google account, your progress is automatically saved securely on our servers.',
    'faq.q3': 'Can I play using a controller?',
    'faq.a3': 'Absolutely. We support most USB and Bluetooth controllers, such as Xbox and PlayStation. Mapping is automatic in most cases.',
    'faq.q4': 'Does it work on mobile?',
    'faq.a4': 'Yes, the platform is responsive and has virtual on-screen controls for you to play comfortably on your smartphone.',
    
    'cta.title': 'Ready for Nostalgia?',
    'cta.desc': 'Join the community and have your favorite classics always just a click away.',
    
    'donate.title': 'Help keep the Platform running!',
    'donate.desc': 'To ensure the project fulfills its mission of connecting generations with nostalgia always online and receives more and more improvements, ',
    'donate.desc_bold': 'any contribution via PIX is incredibly valuable',
    'donate.desc2': '. Be part of supporting this journey!',
    'donate.pix_key': 'Random PIX Key',
    
    'footer.nav': 'Navigation',
    'footer.enter_platform': 'Enter Platform',
    'footer.game_catalog': 'Game Catalog',
    'footer.terms_of_use': 'Terms of Use',
    'footer.copyright_notice': 'Copyright Notice',

    
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
