const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<div className="hidden md:block">\n            <NavItem icon={Trophy} label="Ranking" active={activeTab === "ranking"} onClick={() => setActiveTab("ranking")} />\n          </div>',
  '<NavItem icon={Trophy} label="Ranking" active={activeTab === "ranking"} onClick={() => setActiveTab("ranking")} />'
);

fs.writeFileSync('src/App.tsx', code);
