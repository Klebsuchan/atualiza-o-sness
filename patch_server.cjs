const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const newCss = `
          /* Hide everything by default, but let #wrap be visible and take over the screen */
          body { 
            visibility: hidden !important; 
            background: black !important; 
            overflow: hidden !important; 
            margin: 0 !important; 
            padding: 0 !important; 
          }
          #wrap { 
            visibility: visible !important; 
            position: absolute !important; 
            top: 0 !important; 
            left: 0 !important; 
            width: 100vw !important; 
            height: 100vh !important; 
            display: flex !important; 
            flex-direction: column !important; 
            align-items: center !important; 
            justify-content: center !important; 
            margin: 0 !important; 
            background: black !important;
            z-index: 9999 !important;
          }
          #wrap * {
            visibility: visible !important;
          }
          /* Show hostbar and style it */
          .hostbar {
            visibility: visible !important;
            position: absolute;
            bottom: 20px;
            z-index: 10000;
          }
          .hostbar * {
             visibility: visible !important;
          }
          #canvas { 
            max-width: 100% !important; 
            max-height: calc(100vh - 80px) !important; 
            object-fit: contain !important; 
          }
          #startBtn { 
            margin-top: 20px !important; 
            padding: 15px 30px !important; 
            font-size: 20px !important; 
            cursor: pointer !important; 
            z-index: 9999 !important; 
            position: absolute !important;
          }
          
          /* Hide known overlays like ad-blocker popups */
          .adsbygoogle, iframe[src*="google"], .toast { display: none !important; }
`;

code = code.replace(/(\/\*\s*Hide everything by default[\s\S]*?display: none !important; }\s*)/m, newCss);
fs.writeFileSync('server.ts', code);
