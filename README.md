# 🎮 Wonder SNES Cloud
> Uma experiência profissional e moderna para jogar seus clássicos favoritos de SNES e PlayStation 1 diretamente na nuvem, sem precisar baixar nada.

![Wonder SNES Cloud](https://images.pexels.com/photos/1373114/pexels-photo-1373114.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)

## 🚀 Como funciona?
O **Wonder SNES Cloud** centraliza emuladores de navegador, permitindo que você jogue diversos títulos clássicos do **Super Nintendo (SNES)** e **PlayStation 1 (PS1)** com rapidez e praticidade. Toda a emulação ocorre perfeitamente no seu navegador.

## ✨ Principais Funcionalidades

- **📚 Vasta Biblioteca de Jogos!**
  Catálogo extenso de jogos de SNES e milhares de títulos para PS1 devidamente categorizados e com capas.
- **☁️ Sincronização em Nuvem (Firebase)**
  Faça login com a sua conta do Google! O sistema utiliza o Firebase Auth e Firestore para acompanhar seu histórico e salvar o status de "Jogos Salvos" para acesso rápido.
- **🎮 Suporte Inteligente a Gamepad**
  Conecte qualquer controle (ex: Xbox, DualShock) e ele será detectado via X-Input. O controle pode ser usado nativamente para navegar durante as sessões.
- **🎨 Design Imersivo "Console UI"**
  Um visual de alto padrão inspirado em dashboards oficiais de consoles (tons neons, Xbox dashboard, design flat / blur). Imagens ricas extraídas do Pexels API formam papéis de parede baseados na sua seleção dinamicamente.

## 🛠 Tecnologias Utilizadas

- **Frontend:** React 18 + Vite
- **Estilização:** Tailwind CSS
- **Ícones & UI:** Lucide React e Framer Motion
- **Autenticação e Nuvem:** Firebase
- **Sourcing de Jogos & Emulação:** Emuladores de navegadores Web-based, embutidos.

## ⚙️ Como Executar Localmente

1. Execute a instalação de dependências:
   ```bash
   npm install
   ```

2. Certifique-se de configurar e provisionar os esquemas do `firebase-applet-config.json` para habilitar a rede de Cloud.

3. Inicie o sevidor local:
   ```bash
   npm run dev
   ```

Apenas selecione qualquer título, amplie a tela e tenha um ótimo jogo!
