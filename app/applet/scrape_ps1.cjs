const https = require('https');
https.get('https://www.ps1fun.com', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log(data.match(/<a href="([^"]+)">/g)?.slice(0, 20)));
});
