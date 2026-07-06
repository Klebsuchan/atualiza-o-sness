import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createProxyMiddleware } from "http-proxy-middleware";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // SSEGA Proxies
  const ssegaProxy = createProxyMiddleware({ 
    target: 'https://ssega.com', 
    changeOrigin: true,
    headers: {
      'Referer': 'https://ssega.com/'
    }
  });

  app.use('/content', ssegaProxy);
  app.use('/js', ssegaProxy);
  app.use('/css', ssegaProxy);
  app.use('/lzroms', ssegaProxy);
  app.use('/thumbs', ssegaProxy);
  app.use('/emulator', ssegaProxy); // just in case
  app.use('/ws', ssegaProxy); // maybe for netplay

  app.get('/api/ssega-embed', async (req, res) => {
    try {
      const targetUrl = req.query.url as string;
      if (!targetUrl || !targetUrl.includes('ssega.com')) {
        return res.status(400).send('Invalid URL');
      }

      
      const joinCode = req.query.join;
      let fetchUrl = targetUrl;
      if (joinCode) {
        fetchUrl += (fetchUrl.includes('?') ? '&' : '?') + 'join=' + encodeURIComponent(joinCode);
      }
      const response = await fetch(fetchUrl, {
  
        headers: { 'Referer': 'https://ssega.com/' }
      });
      let html = await response.text();

      // Inject CSS to hide everything except the emulator block
      const injectedCss = `
        <style>
          
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
</style>
      `;
      html = html.replace('</head>', injectedCss + '</head>');

      res.send(html);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error proxying ssega');
    }
  });

  // API route for health
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
