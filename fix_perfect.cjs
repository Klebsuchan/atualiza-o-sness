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
    
    // Create lookup maps by region for perfect exact matches
    const mapUsa = new Map();
    const mapEurope = new Map();
    const mapJapan = new Map();
    const mapWorld = new Map();
    const mapOther = new Map();
    const mapCore = new Map(); // Best effort without region

    for (let b of boxarts) {
        let bLower = b.toLowerCase();
        let core = bLower.replace(/\([^)]+\)/g, '').replace(/\[[^\]]+\]/g, '').trim(); // "super mario world (usa)" -> "super mario world"
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
        
        // Also just save the first seen for a core name
        if (!mapCore.has(normCore)) {
            mapCore.set(normCore, b);
        } else {
            // prioritize USA > World > Europe > Japan for fallback
            let current = mapCore.get(normCore).toLowerCase();
            if (!current.includes('(usa)') && regions.includes('usa')) {
                mapCore.set(normCore, b);
            }
        }
    }

    let existing = fs.readFileSync('src/data/games.ts', 'utf-8');
    const match = existing.match(/export const GAMES: Game\[\] = (\[[\s\S]*?\]);\n/);
    let games = eval(match[1]);
    
    console.log('Total games:', games.length);
    let replaced = 0;
    
    for (let g of games) {
        let originalTitle = g.title.toLowerCase();
        let region = '';
        if (originalTitle.includes(' usa')) region = 'usa';
        else if (originalTitle.includes(' europe')) region = 'europe';
        else if (originalTitle.includes(' japan')) region = 'japan';
        else if (originalTitle.includes(' world')) region = 'world';
        
        // Remove region identifiers from our title to get core
        let coreName = originalTitle.replace(/\b(usa|europe|japan|world|en|fr|de|es|it|beta|rev|demo|hack|translated|the)\b/gi, '').trim();
        let normCore = normalizeTitle(coreName);
        
        let bestMatch = null;
        
        // 1. Try exact region match
        if (region === 'usa' && mapUsa.has(normCore)) bestMatch = mapUsa.get(normCore);
        else if (region === 'europe' && mapEurope.has(normCore)) bestMatch = mapEurope.get(normCore);
        else if (region === 'japan' && mapJapan.has(normCore)) bestMatch = mapJapan.get(normCore);
        else if (region === 'world' && mapWorld.has(normCore)) bestMatch = mapWorld.get(normCore);
        
        // 2. Try generic match (Usa preferred)
        if (!bestMatch && mapCore.has(normCore)) {
            bestMatch = mapCore.get(normCore);
        }
        
        // 3. Try fuzzy subset match if still no match
        // E.g. "super mario world hack 2" -> "super mario world"
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
            // Found a better/perfect match, use it!
            g.imageUrl = 'https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Super_Nintendo_Entertainment_System/master/Named_Boxarts/' + encodeURIComponent(bestMatch).replace(/%20/g, '%20').replace(/'/g, '%27') + '.png';
            g.bannerUrl = 'https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Super_Nintendo_Entertainment_System/master/Named_Snaps/' + encodeURIComponent(bestMatch).replace(/%20/g, '%20').replace(/'/g, '%27') + '.png';
            replaced++;
        }
    }
    
    console.log('Replaced images with LibRetro:', replaced);
    
    const newGamesStr = JSON.stringify(games, null, 2).replace(/\"([a-zA-Z]+)\":/g, '\$1:');
    const finalFile = existing.replace(match[1], newGamesStr);
    fs.writeFileSync('src/data/games.ts', finalFile);
    console.log('Saved to games.ts!');
}

fixImages();
