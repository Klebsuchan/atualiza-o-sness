const https = require('https');
const fs = require('fs');

https.get('https://www.ps1fun.com/', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const titleRegex = /<a[^>]*href="([^"]+)"[^>]*>\s*<p class="post-thumb">\s*<img(?:[^>]*\s)?src="([^"]+)"[^>]*alt="([^"]*)"/ig;
        const mt = [...data.matchAll(titleRegex)];
        
        const games = mt.map(m => {
            let id = m[1].split('/').pop().toLowerCase().replace(/[^a-z0-9]+/g, '-');
            let playUrl = `https://www.ps1fun.com${m[1]}`; // But wait, m[1] might just be `/game-name` or `/play/game-name/123`. Let's check what it is.
            return {
                id,
                title: m[3],
                category: "Diversos",
                imageUrl: `https://www.ps1fun.com${m[2]}`,
                rating: 4.5,
                playUrl
            };
        });
        
        console.log("Found games:", games.length);
        console.log("First 5 games:", games.slice(0, 5));
    });
});
