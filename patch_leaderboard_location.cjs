const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const rankingSectionTarget = `        {/* Ranking Section */}
        {activeTab === "ranking" && (
          <div className="px-4 md:px-8 py-6">
            <GlobalLeaderboard />
          </div>
        )}`;
        
if (code.includes(rankingSectionTarget)) {
  code = code.replace(rankingSectionTarget, "");
}

const savedGamesTarget = `               <div className="mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                    <Gamepad2 className="w-6 h-6 text-xbox-green" /> Jogos Salvos ({savedGames.length})
                  </h3>`;

const savedGamesReplacement = `               <div className="mb-12">
                  <GlobalLeaderboard />
               </div>

               <div className="mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                    <Gamepad2 className="w-6 h-6 text-xbox-green" /> Jogos Salvos ({savedGames.length})
                  </h3>`;

if (code.includes(savedGamesTarget) && !code.includes('<GlobalLeaderboard />\n               </div>')) {
  code = code.replace(savedGamesTarget, savedGamesReplacement);
  console.log("Moved Leaderboard to Profile");
}

fs.writeFileSync('src/App.tsx', code);
