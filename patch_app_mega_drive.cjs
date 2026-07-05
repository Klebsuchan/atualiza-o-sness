const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Add import if not present
if (!content.includes('MegaDrivePlayer')) {
  content = content.replace(
    /import \{ Game \} from "\.\/data\/games";/,
    `import { Game } from "./data/games";\nimport { MegaDrivePlayer } from "./components/MegaDrivePlayer";`
  );
}

// Replace iframe section
const oldSection = `{selectedGame.playUrl ? (
                <iframe 
                  ref={iframeRef}
                  key={selectedGame.id}
                  src={selectedGame.playUrl}
                  className="w-full h-full border-none shadow-2xl"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-modals"
                  onLoad={() => {
                    iframeRef.current?.focus();
                  }}
                  title={\`Cloud Session: \${selectedGame.title}\`}
                ></iframe>
              ) : (`;

const newSection = `{selectedGame.playUrl ? (
                selectedGame.system === 'Mega Drive' ? (
                  <MegaDrivePlayer 
                    playUrl={selectedGame.playUrl} 
                    title={\`Cloud Session: \${selectedGame.title}\`} 
                    iframeRef={iframeRef as any}
                  />
                ) : (
                  <iframe 
                    ref={iframeRef}
                    key={selectedGame.id}
                    src={selectedGame.playUrl}
                    className="w-full h-full border-none shadow-2xl"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-modals"
                    onLoad={() => {
                      iframeRef.current?.focus();
                    }}
                    title={\`Cloud Session: \${selectedGame.title}\`}
                  ></iframe>
                )
              ) : (`;

content = content.replace(oldSection, newSection);
fs.writeFileSync('src/App.tsx', content);
