const fs = require('fs');
const https = require('https');

function getBoxarts() {
    return new Promise((resolve) => {
        https.get('https://api.github.com/repos/libretro-thumbnails/Nintendo_-_Super_Nintendo_Entertainment_System/git/trees/master?recursive=1', { headers: { 'User-Agent': 'node.js' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const json = JSON.parse(data);
                const bs = json.tree.filter(t => t.path.startsWith('Named_Boxarts/') && t.path.endsWith('.png')).map(t => t.path.replace('Named_Boxarts/', '').replace('.png', ''));
                resolve(bs);
            });
        });
    });
}

function normalizeTitle(title) {
    return title.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
}

async function fixImages() {
    console.log('Fetching Libretro boxarts...');
    const boxarts = await getBoxarts();
    
    const mapUsa = new Map();
    const mapEurope = new Map();
    const mapJapan = new Map();
    const mapWorld = new Map();
    const mapOther = new Map();
    const mapCore = new Map(); 

    for (let b of boxarts) {
        let bLower = b.toLowerCase();
        let core = bLower.replace(/\([^)]+\)/g, '').replace(/\[[^\]]+\]/g, '').trim(); 
        let normCore = normalizeTitle(core);
        
        let regions = [];
        if (bLower.includes('(usa)')) regions.push('usa');
        if (bLower.includes('(europe)')) regions.push('europe');
        if (bLower.includes('(japan)')) regions.push('japan');
        if (bLower.includes('(world)')) regions.push('world');
        
        if (regions.includes('usa')) mapUsa.set(normCore, b);
        if (regions.includes('europe')) mapEurope.set(normCore, b);
        if (regions.includes('japan')) mapJapan.set(normCore, b);
        if (regions.includes('world')) mapWorld.set(normCore, b);
        
        if (regions.length === 0) mapOther.set(normCore, b);
        
        if (!mapCore.has(normCore)) {
            mapCore.set(normCore, b);
        } else {
            let current = mapCore.get(normCore).toLowerCase();
            if (!current.includes('(usa)') && regions.includes('usa')) {
                mapCore.set(normCore, b);
            }
        }
    }

    // Load original scraped games to get the original posters
    let scrapedGames = [];
    for (let i of [1,2,3]) {
        if (fs.existsSync(`chunk_${i}.json`)) {
            let text = fs.readFileSync(`chunk_${i}.json`, 'utf-8');
            scrapedGames.push(...JSON.parse(text));
        }
    }
    const posterMap = new Map();
    for (let s of scrapedGames) {
        posterMap.set(s.niceTitle, s.poster);
    }

    let existing = fs.readFileSync('src/data/games.ts', 'utf-8');
    const match = existing.match(/export const GAMES: Game\[\] = (\[[\s\S]*?\]);\n/);
    let games = eval(match[1]);
    
    let replaced = 0;
    let fallbackToRetro = 0;
    
    for (let g of games) {
        let originalTitle = g.title.toLowerCase();
        let region = '';
        if (originalTitle.includes(' usa')) region = 'usa';
        else if (originalTitle.includes(' europe')) region = 'europe';
        else if (originalTitle.includes(' japan')) region = 'japan';
        else if (originalTitle.includes(' world')) region = 'world';
        
        let coreName = originalTitle.replace(/\b(usa|europe|japan|world|en|fr|de|es|it|beta|rev|demo|hack|translated|the)\b/gi, '').trim();
        let normCore = normalizeTitle(coreName);
        
        let bestMatch = null;
        
        if (region === 'usa' && mapUsa.has(normCore)) bestMatch = mapUsa.get(normCore);
        else if (region === 'europe' && mapEurope.has(normCore)) bestMatch = mapEurope.get(normCore);
        else if (region === 'japan' && mapJapan.has(normCore)) bestMatch = mapJapan.get(normCore);
        else if (region === 'world' && mapWorld.has(normCore)) bestMatch = mapWorld.get(normCore);
        
        if (!bestMatch && mapCore.has(normCore)) {
            bestMatch = mapCore.get(normCore);
        }
        
        if (!bestMatch) {
            let tokens = normCore.split(' ');
            while(tokens.length > 1 && !bestMatch) {
                tokens.pop();
                let sub = tokens.join(' ');
                if (region === 'usa' && mapUsa.has(sub)) bestMatch = mapUsa.get(sub);
                else if (mapCore.has(sub)) bestMatch = mapCore.get(sub);
            }
        }
        
        if (bestMatch) {
            g.imageUrl = 'https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Super_Nintendo_Entertainment_System/master/Named_Boxarts/' + encodeURIComponent(bestMatch).replace(/%20/g, '%20').replace(/'/g, '%27') + '.png';
            g.bannerUrl = 'https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Super_Nintendo_Entertainment_System/master/Named_Snaps/' + encodeURIComponent(bestMatch).replace(/%20/g, '%20').replace(/'/g, '%27') + '.png';
            replaced++;
        } else {
            // Restore poster from retrogames instead of leaving a broken/incorrect github link
            let originalPoster = posterMap.get(g.title);
            if (originalPoster) {
                g.imageUrl = originalPoster;
                g.bannerUrl = originalPoster;
                fallbackToRetro++;
            }
        }
    }
    
    console.log('Replaced images with LibRetro:', replaced);
    console.log('Fell back to Retrogames:', fallbackToRetro);
    
    const newGamesStr = JSON.stringify(games, null, 2).replace(/\"([a-zA-Z]+)\":/g, '\$1:');
    const finalFile = existing.replace(match[1], newGamesStr);
    fs.writeFileSync('src/data/games.ts', finalFile);
    console.log('Saved to games.ts!');
}

fixImages();
