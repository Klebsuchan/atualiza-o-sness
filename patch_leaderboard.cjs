const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import { GlobalLeaderboard }')) {
  code = code.replace(
    'import { ChatComponent } from "./components/ChatComponent";', 
    'import { ChatComponent } from "./components/ChatComponent";\nimport { GlobalLeaderboard } from "./components/GlobalLeaderboard";'
  );
}

const target = `                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}`;

const replacement = `                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="px-4 md:px-8">
              <GlobalLeaderboard />
            </div>
          </div>
        )}`;

if (!code.includes('<GlobalLeaderboard')) {
  code = code.replace(target, replacement);
  console.log("Injected GlobalLeaderboard into Home Tab");
} else {
  console.log("Already has GlobalLeaderboard");
}

fs.writeFileSync('src/App.tsx', code);
