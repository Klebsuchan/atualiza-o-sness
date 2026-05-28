const https = require('https');
https.get('https://www.ps1fun.com/games/all', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const matches = [...data.matchAll(/<a href="([^"]+)"><img src="([^"]+)" alt="([^"]+)"/g)];
        console.log("Matches:", matches.map(m => m[3]).slice(0, 5));
    });
});
