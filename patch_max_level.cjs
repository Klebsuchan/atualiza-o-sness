const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `                        {userStats && (
                          <div className="absolute -bottom-2 -right-2 bg-xbox-green text-white font-extrabold text-xs md:text-sm px-2 py-1 rounded-full border-2 border-black shadow-[0_0_10px_rgba(16,124,16,1)]">
                            LVL {userStats.level}
                          </div>
                        )}`;

const replacement1 = `                        {userStats && (
                          <div className="absolute -bottom-2 -right-2 bg-xbox-green text-white font-extrabold text-xs md:text-sm px-2 py-1 rounded-full border-2 border-black shadow-[0_0_10px_rgba(16,124,16,1)]">
                            LVL {user.email === 'braian.kleber.camargo@gmail.com' ? 'MAX' : userStats.level}
                          </div>
                        )}`;

const target2 = `                      <div className="flex justify-between items-center text-sm font-bold uppercase tracking-wider">
                        <span className="text-white/60">{t("profile.xp")}</span>
                        <span className="text-xbox-green">{userStats.xp} / {userStats.nextLevelXp} XP</span>
                      </div>
                      <div className="w-full bg-black/50 rounded-full h-3 border border-white/10 overflow-hidden relative">
                        <div 
                          className="bg-gradient-to-r from-emerald-600 to-xbox-green h-full rounded-full relative transition-all duration-1000 ease-out" 
                          style={{ width: \`\${Math.min(100, Math.max(0, ((userStats.xp - ((userStats.level - 1) * 500)) / 500) * 100))}%\` }}
                        >`;

const replacement2 = `                      <div className="flex justify-between items-center text-sm font-bold uppercase tracking-wider">
                        <span className="text-white/60">{t("profile.xp")}</span>
                        <span className="text-xbox-green">{user.email === 'braian.kleber.camargo@gmail.com' ? 'MÁXIMO' : \`\${userStats.xp} / \${userStats.nextLevelXp} XP\`}</span>
                      </div>
                      <div className="w-full bg-black/50 rounded-full h-3 border border-white/10 overflow-hidden relative">
                        <div 
                          className="bg-gradient-to-r from-emerald-600 to-xbox-green h-full rounded-full relative transition-all duration-1000 ease-out" 
                          style={{ width: user.email === 'braian.kleber.camargo@gmail.com' ? '100%' : \`\${Math.min(100, Math.max(0, ((userStats.xp - ((userStats.level - 1) * 500)) / 500) * 100))}%\` }}
                        >`;

code = code.replace(target1, replacement1);
code = code.replace(target2, replacement2);

fs.writeFileSync('src/App.tsx', code);
