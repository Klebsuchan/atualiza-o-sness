const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(/SINCRONIZANDO REPOSITÓRIOS\.\.\./, `{t("loading.sync")}`);
content = content.replace(/Carregando Biblioteca Real/, `{t("loading.real_lib")}`);
content = content.replace(/Controle Conectado/, `{t("app.controller_connected")}`);
content = content.replace(/Conta não conectada/, `{t("auth.not_connected")}`);
content = content.replace(/Faça login com o Google para salvar o seu progresso na Nuvem em qualquer jogo, visualizar seu histórico, e manter um backup seguro online sincronizado\./, `{t("auth.login_reason")}`);
content = content.replace(/>Erro:</, `>{t("error.title")}<`);
content = content.replace(/Para contornar, você pode abrir este app em uma /, `{t("error.open_new_window")} `);
content = content.replace(/>nova janela</, `>{t("error.new_window_link")}<`);
content = content.replace(/↗️ Abrir em Nova Janela/, `{t("error.btn_new_window")}`);
content = content.replace(/>Salvo</, `>{t("profile.saved")}<`);
content = content.replace(/Você ainda não tem jogos salvos na nuvem\./, `{t("profile.no_saves")}`);
content = content.replace(/Abra um jogo e clique em "Salvar Progresso" para sincronizá-lo aqui\./, `{t("profile.no_saves_desc")}`);
content = content.replace(/Reviva a era de ouro dos jogos 3D\. Selecione um jogo abaixo e comece a jogar imediatamente no navegador\./, `{t("ps1.desc")}`);
content = content.replace(/A era de ouro dos 16-bits\. Clássicos inesquecíveis\./, `{t("snes.desc")}`);
content = content.replace(/Velocidade e atitude\. Reviva a era da Sega\./, `{t("mega.desc")}`);
content = content.replace(/>Nenhum jogo encontrado</, `>{t("search.not_found")}<`);
content = content.replace(/Não encontramos resultados para "\{searchQuery\}"\. Tente usar palavras-chave diferentes\./, `{t("search.not_found_desc").replace('{searchQuery}', searchQuery)}`);
content = content.replace(/>Desenvolvedora</, `>{t("game.developer")}<`);
content = content.replace(/>Plataforma</, `>{t("game.platform")}<`);
content = content.replace(/>Sessão de Nuvem Ativa</, `>{t("game.cloud_session")}<`);
content = content.replace(/Salvar na Cloud/, `{t("game.save_cloud")}`);
content = content.replace(/>SALVAR</g, `>{t("game.btn_save")}<`);
content = content.replace(/>ROM não conectada</, `>{t("game.rom_not_connected")}<`);
content = content.replace(/🎮 CONTROLE AUTO-DETECTADO • PADRÃO SUPER NINTENDO \(A CONFIRMA, B VOLTA\)/, `{t("game.controls_auto")}`);
content = content.replace(/CONTROLES: SETAS = MOVER • X\/S = A\/B • D\/C = X\/Y • ENTER = START • SHIFT = SELECT/, `{t("game.controls_manual")}`);
content = content.replace(/>Ver todos</g, `>{t("app.see_all")}<`);

fs.writeFileSync('src/App.tsx', content);
