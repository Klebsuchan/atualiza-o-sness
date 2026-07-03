const fs = require('fs');

let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// Add import
code = code.replace(
    'import { motion } from "motion/react";',
    'import { motion } from "motion/react";\nimport { useLanguage } from "../contexts/LanguageContext";'
);

// Add hook
code = code.replace(
    'export function LandingPage({ onEnter }: { onEnter: () => void }) {',
    'export function LandingPage({ onEnter }: { onEnter: () => void }) {\n  const { t, language, setLanguage } = useLanguage();'
);

// Add language button in header
code = code.replace(
    '<nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">',
    '<nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">\n          <button onClick={() => setLanguage(language === "pt" ? "en" : "pt")} className="flex items-center gap-1 hover:text-white transition-colors bg-white/5 px-2 py-1 rounded-md text-xs font-bold border border-white/10 uppercase">{language}</button>'
);

// Replace nav texts
code = code.replace('>Catálogo</a>', '>{t("nav.catalogo")}</a>');
code = code.replace('>Sistemas</a>', '>{t("nav.sistemas")}</a>');
code = code.replace('>Sobre</a>', '>{t("nav.sobre")}</a>');

// Button texts
code = code.replace('> Entrar', '> {t("nav.entrar")}');
code = code.replace('>Jogar Agora<', '>{t("nav.jogar_agora")}<');

// Hero texts
code = code.replace('Reviva os <br />', '{t("hero.title1")} <br />');
code = code.replace('Anos Dourados.', '{t("hero.title2")}');
code = code.replace('Uma plataforma em nuvem elegante com a biblioteca definitiva de Super Nintendo, Sega Mega Drive e PlayStation 1. Salve seu progresso e jogue de qualquer lugar.', '{t("hero.subtitle")}');

// Como funciona texts
code = code.replace('Como Funciona', '{t("sobre.title")}');

// Note: I will just use regex to replace specific texts or I can write a small script to replace all of them.
fs.writeFileSync('src/components/LandingPage.tsx', code);
