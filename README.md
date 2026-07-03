<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/cloud.svg" alt="Wonder Games Cloud" width="80" height="80" />
  <h1 align="center">Wonder Games Cloud</h1>
  <p align="center">
    <strong>Reviva a era de ouro dos videogames. Diretamente do seu navegador.</strong>
  </p>
  <p align="center">
    Uma plataforma em nuvem elegante com a biblioteca definitiva de Super Nintendo, Sega Mega Drive e PlayStation 1.
  </p>
</div>

---

## 🎮 Sobre o Projeto

O **Wonder Games Cloud** é a plataforma definitiva para fãs de retro gaming. Construída com tecnologias web modernas, ela permite que você jogue milhares de jogos clássicos de SNES, Mega Drive e PS1 diretamente do seu navegador, sem necessidade de emuladores locais, downloads de ROMs ou configurações complexas.

Com um sistema integrado de autenticação e banco de dados em nuvem, seu progresso é salvo instantaneamente. Você pode começar a jogar no computador e continuar de onde parou em qualquer outro dispositivo.

## ✨ Principais Funcionalidades

- 🌐 **Jogue no Navegador:** Emuladores web integrados de altíssima performance para SNES, Mega Drive e PS1.
- ☁️ **Cloud Saves:** Faça login com sua conta Google e salve seu progresso na nuvem. Nunca mais perca um *save state*.
- 🎮 **Suporte a Gamepad:** Experiência "Plug & Play". Conecte seu controle (Xbox, PlayStation, genéricos) e jogue imediatamente. O sistema mapeia os botões automaticamente.
- 🏆 **Sistema de Progressão (XP):** Ganhe pontos de experiência por cada minuto jogado e bônus de login diário. Suba de nível e acompanhe suas estatísticas de jogo no seu perfil.
- 🌍 **Bilingue:** Suporte completo para Português (PT-BR) e Inglês (EN), alternável a qualquer momento.
- 🎨 **Design Moderno e Imersivo:** Interface de usuário minimalista, escura e inspirada em interfaces modernas de consoles de mesa.
- 📱 **Totalmente Responsivo:** Desenhado para funcionar e ser lindo tanto em monitores ultrawide quanto em dispositivos móveis.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes ferramentas modernas do ecossistema front-end e nuvem:

- **Frontend:** React 18, TypeScript, Vite
- **Estilização:** Tailwind CSS (estilo utilitário de alta produtividade)
- **Animações:** Framer Motion (Motion para React)
- **Ícones:** Lucide React
- **Backend & Autenticação:** Firebase (Firestore & Authentication)
- **Estrutura de Dados:** Context API (AuthContext, LanguageContext)

## 🚀 Como Executar Localmente

Siga as instruções abaixo para rodar o projeto no seu ambiente de desenvolvimento local.

### 1. Pré-requisitos

- [Node.js](https://nodejs.org/en/) (Versão 18+)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### 2. Clonando o Repositório

```bash
git clone https://github.com/seu-usuario/wonder-games-cloud.git
cd wonder-games-cloud
```

### 3. Configurando o Firebase

Crie um projeto no [Firebase Console](https://console.firebase.google.com/) e ative:
- **Authentication:** Provedor Google.
- **Firestore Database:** Crie um banco de dados e configure as regras de segurança baseadas no arquivo de regras do projeto.

No arquivo `src/lib/firebase.ts`, adicione suas credenciais do Firebase, ou utilize o arquivo de configuração `firebase-applet-config.json` padrão gerado.

### 4. Instalação de Dependências e Execução

```bash
# Instalar dependências
npm install

# Rodar em ambiente de desenvolvimento
npm run dev
```

O servidor estará rodando em `http://localhost:3000`.

## 📂 Estrutura do Projeto

```text
src/
├── components/      # Componentes reutilizáveis (LandingPage, TipOfTheDay, etc)
├── contexts/        # Gerenciamento de estado global (Auth, Language)
├── data/            # Bibliotecas estáticas de jogos
├── hooks/           # Custom React hooks (useGamepad)
├── lib/             # Configurações de serviços externos (Firebase)
├── services/        # Integrações e APIs (Pexels)
├── App.tsx          # Aplicação principal / Roteamento
├── index.css        # Estilos globais (Tailwind)
└── main.tsx         # Ponto de entrada
```

## ⚖️ Aviso Legal (Disclaimer)

Esta é uma aplicação frontend de portfólio que utiliza links públicos de emulação em nuvem (iframes). **Nenhum arquivo ROM, BIOS ou material protegido por direitos autorais é hospedado neste repositório ou nos servidores da aplicação.**

*Por questões de direitos autorais, algumas capas de jogos podem não estar disponíveis, mas a emulação é feita dinamicamente via serviços de terceiros.*

## 📝 Licença

Distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais informações.

---
<div align="center">
Feito com 💚 para a comunidade Retro Gaming.
</div>
