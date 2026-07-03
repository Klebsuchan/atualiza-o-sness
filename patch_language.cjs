const fs = require('fs');

let content = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf-8');

const ptAdditions = `
    'nav.saiba_mais': 'Saiba Mais',
    
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
`;

const enAdditions = `
    'nav.saiba_mais': 'Learn More',
    
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
`;

// Insert into pt
content = content.replace(/(\'nav\.jogar_agora\': \'Jogar Agora\',)/, `$1\n${ptAdditions}`);
// Insert into en
content = content.replace(/(\'nav\.jogar_agora\': \'Play Now\',)/, `$1\n${enAdditions}`);

// Testimonials are hard to parameterize beautifully here, let's also add them.
const ptTestimonials = `
    'community.t1.text': 'Finalmente posso jogar meus RPGs de SNES no intervalo do trabalho e continuar do celular em casa. O cloud save é perfeito!',
    'community.t1.name': 'Lucas M.',
    'community.t2.text': 'A interface é muito fluida e jogar PS1 no navegador sem instalar nada é mágico. Recomendo muito!',
    'community.t2.name': 'Mariana R.',
    'community.t3.text': 'Conectei meu controle de Xbox via Bluetooth e o mapeamento foi automático. A melhor plataforma retro que já usei.',
    'community.t3.name': 'Thiago K.',
`;

const enTestimonials = `
    'community.t1.text': 'Finally I can play my SNES RPGs during my work break and continue on my phone at home. Cloud save is perfect!',
    'community.t1.name': 'Lucas M.',
    'community.t2.text': 'The interface is very fluid and playing PS1 in the browser without installing anything is magical. Highly recommended!',
    'community.t2.name': 'Mariana R.',
    'community.t3.text': 'I connected my Xbox controller via Bluetooth and mapping was automatic. The best retro platform I have ever used.',
    'community.t3.name': 'Thiago K.',
`;

content = content.replace(/(    'community\.title': 'O que a comunidade diz',)/, `$1\n${ptTestimonials}`);
content = content.replace(/(    'community\.title': 'What the community says',)/, `$1\n${enTestimonials}`);

fs.writeFileSync('src/contexts/LanguageContext.tsx', content);
