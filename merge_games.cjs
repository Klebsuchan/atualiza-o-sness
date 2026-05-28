const fs = require('fs');
const https = require('https');
const stringSimilarity = require('string-similarity');

function getCategory(title) {
    title = title.toLowerCase();
    if (title.includes('mario') || title.includes('sonic')) return 'Aventura';
    if (title.includes('stree') || title.includes('mortal') || title.includes('fight') || title.includes('smash')) return 'Luta';
    if (title.includes('racing') || title.includes('kart') || title.includes('top gear') || title.includes('f-zero')) return 'Corrida';
    if (title.includes('zelda') || title.includes('final fantasy') || title.includes('chron')) return 'Ação-Aventura';
    if (title.includes('donkey kong')) return 'Aventura';
    if (title.includes('soccer') || title.includes('fifa') || title.includes('nba') || title.includes('madden')) return 'Esportes';
    return 'Outros';
}

async function getBoxarts() {
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

async function main() {
    console.log('Fetching Libretro boxarts...');
    const boxarts = await getBoxarts();
    
    let scrapedGames = [];
    for (let i of [1,2,3]) {
        let text = fs.readFileSync(`chunk_${i}.json`, 'utf-8');
        scrapedGames.push(...JSON.parse(text));
    }
    
    const seenMap = new Map();
    for (let g of scrapedGames) {
        seenMap.set(g.id, g);
    }
    const uniqueGames = Array.from(seenMap.values());
    console.log('Unique games:', uniqueGames.length);
    
    // Quick token based match
    function getTokens(str) {
        return new Set(str.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(Boolean));
    }
    const boxartsTokens = boxarts.map(b => getTokens(b.replace(/\([^)]+\)/g, '')));
    
    let newGames = [];
    let idCount = 4000;
    let replaced = 0;
    
    for (let s of uniqueGames) {
        let playUrl = 'https://www.retrogames.cc/embed/' + s.id + '-' + s.title + '.html';
        let niceTitle = s.niceTitle;
        let searchTitle = niceTitle.toLowerCase();
        
        let coreName = searchTitle.replace(/\b(usa|europe|japan|en|fr|de|es|it|beta|rev|demo|hack|translated|the)\b/gi, '').trim();
        let targetTokens = getTokens(coreName);
        
        let bestScore = 0;
        let bestMatch = null;
        
        // Exact matching first
        let exactMatch = boxarts.find(b => b.toLowerCase().replace(/\([^)]+\)/g, '').trim() === coreName);
        if (exactMatch) {
            bestScore = 1;
            bestMatch = exactMatch;
        } else {
            // Jaccard similarity fallback
            for (let i = 0; i < boxarts.length; i++) {
                let bt = boxartsTokens[i];
                let intersection = 0;
                for (let t of targetTokens) {
                    if (bt.has(t)) intersection++;
                }
                let union = targetTokens.size + bt.size - intersection;
                let score = union === 0 ? 0 : intersection / union;
                
                // Region heuristics
                let b = boxarts[i].toLowerCase();
                let regionMatches = false;
                if (searchTitle.includes('usa') && (b.includes('(usa)') || b.includes('(world)'))) regionMatches = true;
                if (searchTitle.includes('japan') && b.includes('(japan)')) regionMatches = true;
                if (searchTitle.includes('europe') && b.includes('(europe)')) regionMatches = true;
                
                if (regionMatches) score += 0.2;
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = boxarts[i];
                }
            }
        }
        
        let imageUrl = s.poster;
        let bannerUrl = s.poster;
        if (bestScore >= 0.5 && bestMatch) {
            imageUrl = 'https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Super_Nintendo_Entertainment_System/master/Named_Boxarts/' + encodeURIComponent(bestMatch).replace(/%20/g, '%20').replace(/'/g, '%27') + '.png';
            bannerUrl = 'https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Super_Nintendo_Entertainment_System/master/Named_Snaps/' + encodeURIComponent(bestMatch).replace(/%20/g, '%20').replace(/'/g, '%27') + '.png';
            replaced++;
        }
        
        newGames.push({
            id: 'sn-' + (idCount++),
            title: niceTitle,
            category: getCategory(niceTitle),
            description: 'Jogue ' + niceTitle + ' diretamente no seu navegador!',
            rating: 4.5,
            system: 'SNES',
            imageUrl: imageUrl,
            bannerUrl: bannerUrl,
            playUrl: playUrl
        });
    }
    
    console.log('Replaced images with LibRetro:', replaced);
    
    let existing = fs.readFileSync('src/data/games.ts', 'utf-8');
    const match = existing.match(/export const GAMES: Game\[\] = (\[[\s\S]*?\]);\n/);
    if (match) {
        const newGamesStr = JSON.stringify(newGames, null, 2).replace(/\"([a-zA-Z]+)\":/g, '\$1:');
        const finalFile = existing.replace(match[1], newGamesStr);
        fs.writeFileSync('src/data/games.ts', finalFile);
        console.log('Saved to games.ts! Total built:', newGames.length);
    }
}
main();
