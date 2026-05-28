const https = require('https');
const fs = require('fs');

function fetchHtml(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', () => resolve(''));
    });
  });
}

async function scrapeGames() {
    const html = await fetchHtml('https://www.ps1fun.com/');
    const titleRegex = /<a[^>]*href="([^"]+)"[^>]*>\s*<p class="post-thumb">\s*<img(?:[^>]*\s)?src="([^"]+)"[^>]*alt="([^"]*)"/ig;
    const mt = [...html.matchAll(titleRegex)];
    
    const games = mt.map(m => {
        let id = m[1].split('/').pop().toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return {
            id,
            title: m[3].replace(/&#039;/g, "'").replace(/&amp;/g, "&"),
            category: "Ação", // you can generalize it
            imageUrl: `https://www.ps1fun.com${m[2]}`,
            bannerUrl: `https://www.ps1fun.com${m[2]}`,
            description: "Jogue este clássico do PS1 diretamente no seu navegador.",
            rating: 4.8,
            detailUrl: `https://www.ps1fun.com${m[1]}`
        };
    }).slice(0, 16); // take 16 games

    for (let g of games) {
        const detailHtml = await fetchHtml(g.detailUrl);
        const playMatch = detailHtml.match(/href="(\/play\/[^"]+)"/);
        if (playMatch) {
            g.playUrl = `https://www.ps1fun.com${playMatch[1]}`;
        } else {
            g.playUrl = null;
        }
        delete g.detailUrl;
    }
    
    fs.writeFileSync('ps1_games.json', JSON.stringify(games.filter(g => g.playUrl), null, 2));
    console.log("Saved ps1_games.json with", games.filter(g => g.playUrl).length, "games.");
}

scrapeGames();
