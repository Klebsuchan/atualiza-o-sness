const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
    'import { LandingPage } from "./components/LandingPage";',
    'import { LandingPage } from "./components/LandingPage";\nimport { useLanguage } from "./contexts/LanguageContext";'
);

code = code.replace(
    'export default function App() {',
    'export default function App() {\n  const { t, language, setLanguage } = useLanguage();'
);

// Menu translations
code = code.replace('Buscar jogos...', '{t("app.search")}');
code = code.replace('Início', '{t("app.home")}');
code = code.replace('Super Nintendo', '{t("app.nintendo")}');
code = code.replace('Mega Drive', '{t("app.sega")}');
code = code.replace('PlayStation 1', '{t("app.playstation")}');
code = code.replace('Perfil', '{t("app.profile")}');
code = code.replace('Em Destaque', '{t("app.featured")}');
code = code.replace('Continuar Jogando', '{t("app.continue")}');
code = code.replace('Catálogo Completo', '{t("app.catalog")}');

// Profile section
code = code.replace('Seu Perfil Retro', '{t("profile.title")}');
code = code.replace('Faça login para salvar seu progresso na nuvem, ganhar XP e muito mais!', '{t("profile.login_prompt")}');
code = code.replace('Entrar com Google', '{t("profile.login_btn")}');
code = code.replace('Estatísticas', '{t("profile.stats")}');
code = code.replace('Dias Jogados', '{t("profile.days_played")}');
code = code.replace('Experiência', '{t("profile.xp")}');
code = code.replace('Nível', '{t("profile.level")}');
code = code.replace('Jogos Salvos', '{t("profile.saved_games")}');
code = code.replace('Sair da Conta', '{t("profile.logout")}');

// Game play section
code = code.replace('SALVAR NA NUVEM', '{t("game.save_progress")}');
code = code.replace('SALVANDO...', '{t("game.saving")}');
code = code.replace('ENCERRAR SESSÃO', '{t("game.end_session")}');
code = code.replace('>SAIR<', '>{t("game.exit")}<');
code = code.replace('INICIAR GAMEPLAY', '{t("game.start")}');
code = code.replace('Jogar', '{t("app.play")}'); // Watch out for multiple replaces

// Language Toggle in top bar
// Find a place to put the toggle in App.tsx top bar. Wait, the user might want it there too. Let's add it next to the search input
code = code.replace(
    '</form>',
    '</form>\n          <button onClick={() => setLanguage(language === "pt" ? "en" : "pt")} className="flex items-center justify-center w-10 h-10 bg-glass text-zinc-400 hover:text-white rounded-xl transition-all font-bold uppercase">{language}</button>'
);

fs.writeFileSync('src/App.tsx', code);
