const fs = require('fs');

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

content = content.replace(/>Saiba Mais</, `>{t("nav.saiba_mais")}<`);
content = content.replace(/Como Funciona/, `{t("sobre.title")}`);
content = content.replace(/Suba de Nível <br className="hidden md:block"\/>Jogando/, `{t("features.level_up.title1")} <br className="hidden md:block"/>{t("features.level_up.title2")}`);
content = content.replace(/Jogador Clássico/, `{t("features.classic_player")}`);
content = content.replace(/Conta Conectada/, `{t("features.connected_account")}`);
content = content.replace(/>Experiência</, `>{t("features.experience")}<`);
content = content.replace(/Dias Jogados/, `{t("features.days_played")}`);
content = content.replace(/Jogos Salvos/, `{t("features.saved_games")}`);

content = content.replace(/Save State na Nuvem/, `{t("benefits.save_state")}`);
content = content.replace(/Controles Nativos/, `{t("benefits.native_controls")}`);
content = content.replace(/Performace Fluida/, `{t("benefits.fluid_performance")}`);
content = content.replace(/Múltiplas Plataformas/, `{t("benefits.multi_platform")}`);
content = content.replace(/Desfrute de milhares de títulos inesquecíveis do Super Nintendo \(SNES\), da velocidade do Sega Mega Drive e dos clássicos em 3D do PlayStation 1./, `{t("benefits.desc")}`);

content = content.replace(/O que a comunidade diz/, `{t("community.title")}`);

content = content.replace(/Perguntas Frequentes/, `{t("faq.title")}`);

content = content.replace(/Pronto para a Nostalgia\?/, `{t("cta.title")}`);
content = content.replace(/Junte-se à comunidade e tenha seus clássicos favoritos sempre ao alcance de um clique./, `{t("cta.desc")}`);

content = content.replace(/Ajude a manter a Plataforma no ar!/, `{t("donate.title")}`);
content = content.replace(/Para garantir que o projeto cumpra a missão de conectar gerações com a nostalgia sempre online e receba cada vez mais melhorias, /, `{t("donate.desc")}`);
content = content.replace(/<strong>qualquer contribuição via PIX é incrivelmente valiosa<\/strong>/, `<strong>{t("donate.desc_bold")}</strong>`);
content = content.replace(/\. Faça parte do suporte desta jornada!/, `{t("donate.desc2")}`);
content = content.replace(/Chave PIX Aleatória/, `{t("donate.pix_key")}`);

content = content.replace(/Navegação/, `{t("footer.nav")}`);
content = content.replace(/Entrar na Plataforma/, `{t("footer.enter_platform")}`);
content = content.replace(/Catálogo de Jogos/, `{t("footer.game_catalog")}`);
content = content.replace(/Termos de Uso/, `{t("footer.terms_of_use")}`);
content = content.replace(/Aviso de Direitos Autorais/, `{t("footer.copyright_notice")}`);

// Replace testimonials
content = content.replace(
  /name: "Lucas M.", text: "Finalmente posso jogar meus RPGs de SNES no intervalo do trabalho e continuar do celular em casa. O cloud save é perfeito!"/,
  `name: t("community.t1.name"), text: t("community.t1.text")`
);
content = content.replace(
  /name: "Mariana R.", text: "A interface é muito fluida e jogar PS1 no navegador sem instalar nada é mágico. Recomendo muito!"/,
  `name: t("community.t2.name"), text: t("community.t2.text")`
);
content = content.replace(
  /name: "Thiago K.", text: "Conectei meu controle de Xbox via Bluetooth e o mapeamento foi automático. A melhor plataforma retro que já usei."/,
  `name: t("community.t3.name"), text: t("community.t3.text")`
);

// Replace FAQs
content = content.replace(
  /q: "Preciso baixar ou instalar algum emulador\?", a: "Não. A Wonder Games Cloud funciona 100% no seu navegador usando tecnologia WebAssembly. Basta acessar e jogar."/,
  `q: t("faq.q1"), a: t("faq.a1")`
);
content = content.replace(
  /q: "O salvamento em nuvem é gratuito\?", a: "Sim! Ao conectar com sua conta Google, seu progresso é salvo automaticamente em nossos servidores de forma segura."/,
  `q: t("faq.q2"), a: t("faq.a2")`
);
content = content.replace(
  /q: "Posso jogar usando um controle\?", a: "Com certeza. Suportamos a maioria dos controles USB e Bluetooth, como de Xbox e PlayStation. O mapeamento é feito automaticamente na maioria dos casos."/,
  `q: t("faq.q3"), a: t("faq.a3")`
);
content = content.replace(
  /q: "Funciona no celular\?", a: "Sim, a plataforma é responsiva e possui controles virtuais na tela para você jogar no smartphone de forma confortável."/,
  `q: t("faq.q4"), a: t("faq.a4")`
);

fs.writeFileSync('src/components/LandingPage.tsx', content);
