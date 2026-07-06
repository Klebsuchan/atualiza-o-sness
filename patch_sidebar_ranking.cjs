const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add Trophy to lucide-react imports if not there
if (code.includes('import { ') && !code.includes('Trophy')) {
  code = code.replace('import { Home, Gamepad2, Play, Search, ArrowRight, Star, Heart, X, LogOut, Radio, Library, User, Cloud } from "lucide-react";', 
                      'import { Home, Gamepad2, Play, Search, ArrowRight, Star, Heart, X, LogOut, Radio, Library, User, Cloud, Trophy } from "lucide-react";');
}

// 2. Add Ranking to Sidebar
const navTarget = `<div className="hidden md:block">
            <NavItem icon={User} label="Perfil" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
          </div>`;
const navReplacement = `<div className="hidden md:block">
            <NavItem icon={User} label="Perfil" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
          </div>
          <div className="hidden md:block">
            <NavItem icon={Trophy} label="Ranking" active={activeTab === "ranking"} onClick={() => setActiveTab("ranking")} />
          </div>`;

if (!code.includes('activeTab === "ranking"')) {
  code = code.replace(navTarget, navReplacement);
}

// 3. Remove GlobalLeaderboard from home
const homeTarget = `            
            <div className="px-4 md:px-8">
              <GlobalLeaderboard />
            </div>
          </div>
        )}`;
const homeReplacement = `          </div>
        )}`;
if (code.includes(homeTarget)) {
  code = code.replace(homeTarget, homeReplacement);
}

// 4. Render GlobalLeaderboard in its own tab
const rankingSectionTarget = `{/* Profile Section */}`;
const rankingSectionReplacement = `{/* Ranking Section */}
        {activeTab === "ranking" && (
          <div className="px-4 md:px-8 py-6">
            <GlobalLeaderboard />
          </div>
        )}
        
        {/* Profile Section */}`;
if (!code.includes('{/* Ranking Section */}')) {
  code = code.replace(rankingSectionTarget, rankingSectionReplacement);
}

fs.writeFileSync('src/App.tsx', code);
