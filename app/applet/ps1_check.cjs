const https = require('https');
https.get('https://www.ps1fun.com/play/spyro-the-dragon/1730', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const scriptMatch = data.match(/<script.*?>(.*?)<\/script>/gs);
        if (scriptMatch) {
            scriptMatch.forEach(s => {
                if (s.includes('ifr') || s.includes('game') || s.includes('Rom') || s.includes('ps1fun')) {
                    console.log(s);
                }
            });
        }
    });
});
