const https = require('https');
https.get('https://www.ps1fun.com/play/spyro-the-dragon/1730', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const lines = data.split('\n');
        lines.forEach(l => {
            if (l.includes('embed') || l.includes('iframe')) {
                console.log(l);
            }
        });
    });
});
