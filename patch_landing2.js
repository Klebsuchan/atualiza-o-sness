const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

code = code.replace('Conecte sua Conta', '{t("sobre.card1.title")}');
code = code.replace('Faça login com o Google em segundos para criar seu perfil e habilitar o salvamento em nuvem.', '{t("sobre.card1.desc")}');
code = code.replace('Escolha seu Clássico', '{t("sobre.card2.title")}');
code = code.replace('Explore nossa biblioteca com milhares de jogos de SNES, Mega Drive e PS1.', '{t("sobre.card2.desc")}');
code = code.replace('Jogue e Salve', '{t("sobre.card3.title")}');
code = code.replace('Jogue com ou sem controle. Salve o progresso na nuvem e continue de onde parou em qualquer dispositivo.', '{t("sobre.card3.desc")}');

code = code.replace('Clássicos Inesquecíveis', '{t("catalogo.title")}');
code = code.replace('Os maiores sucessos da era de ouro dos videogames estão aqui, prontos para serem jogados diretamente do seu navegador.', '{t("catalogo.subtitle")}');

// Let's add the copyright message here
code = code.replace(
    '</p>',
    '</p>\n           <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500/80 p-4 rounded-xl max-w-2xl mx-auto mb-12 text-sm text-left flex items-start gap-3"><Zap className="w-5 h-5 flex-shrink-0 mt-0.5" /><div><strong className="block mb-1">{t("catalogo.covers.title")}</strong>{t("catalogo.covers.desc")}</div></div>'
);

code = code.replace('Sistemas Suportados', '{t("sistemas.title")}');
code = code.replace('A era de ouro dos 16-bits. Jogue clássicos como Super Mario World, Zelda e Donkey Kong Country.', '{t("sistemas.snes.desc")}');
code = code.replace('O console que trouxe jogos mais rápidos e maduros. Reviva Sonic, Streets of Rage e muito mais.', '{t("sistemas.genesis.desc")}');
code = code.replace('A revolução 3D. Experimente a magia de Final Fantasy VII, Crash Bandicoot e Metal Gear Solid.', '{t("sistemas.ps1.desc")}');

code = code.replace('Reviva a era de ouro dos videogames. Sua plataforma definitiva para jogar clássicos do SNES, Mega Drive e PS1 diretamente do navegador com salvamento em nuvem.', '{t("footer.desc")}');
code = code.replace('Links Rápidos', '{t("footer.links")}');
code = code.replace('Legal', '{t("footer.legal")}');
code = code.replace('Termos de Serviço', '{t("footer.terms")}');
code = code.replace('Política de Privacidade', '{t("footer.privacy")}');
code = code.replace('Feito com paixão pelos retro games.', '{t("footer.copyright")}');

fs.writeFileSync('src/components/LandingPage.tsx', code);
