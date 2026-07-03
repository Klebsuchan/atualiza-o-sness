const fs = require('fs');

let content = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf-8');

const ptAdditions = `
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
`;

const enAdditions = `
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
    'profile.no_saves': 'You don\'t have any games saved in the cloud yet.',
    'profile.no_saves_desc': 'Open a game and click "Save Progress" to sync it here.',
    'ps1.desc': 'Relive the golden era of 3D games. Select a game below and start playing immediately in the browser.',
    'snes.desc': 'The 16-bit golden era. Unforgettable classics.',
    'mega.desc': 'Speed and attitude. Relive the Sega era.',
    'search.not_found': 'No games found',
    'search.not_found_desc': 'We didn\'t find results for "{searchQuery}". Try using different keywords.',
    'game.developer': 'Developer',
    'game.platform': 'Platform',
    'game.cloud_session': 'Active Cloud Session',
    'game.save_cloud': 'Save to Cloud',
    'game.btn_save': 'SAVE',
    'game.rom_not_connected': 'ROM not connected',
    'game.controls_auto': '🎮 CONTROLLER AUTO-DETECTED • SUPER NINTENDO STANDARD (A CONFIRM, B BACK)',
    'game.controls_manual': 'CONTROLS: ARROWS = MOVE • X/S = A/B • D/C = X/Y • ENTER = START • SHIFT = SELECT',
    'app.see_all': 'See all',
`;

content = content.replace(/(\'nav\.saiba_mais\': \'Saiba Mais\',)/, `$1\n${ptAdditions}`);
content = content.replace(/(\'nav\.saiba_mais\': \'Learn More\',)/, `$1\n${enAdditions}`);

fs.writeFileSync('src/contexts/LanguageContext.tsx', content);
