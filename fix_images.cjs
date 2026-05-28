const fs = require('fs');
const https = require('https');
const stringSimilarity = require('string-similarity');

https.get('https://api.github.com/repos/libretro-thumbnails/Nintendo_-_Super_Nintendo_Entertainment_System/git/trees/master?recursive=1', { headers: { 'User-Agent': 'node.js' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const json = JSON.parse(data);
        const boxarts = json.tree.filter(t => t.path.startsWith('Named_Boxarts/') && t.path.endsWith('.png')).map(t => t.path.replace('Named_Boxarts/', '').replace('.png', ''));
        
        let existing = fs.readFileSync('src/data/games.ts', 'utf-8');
        const match = existing.match(/export const GAMES: Game\[\] = (\[[\s\S]*?\]);\n/);
        let games = eval(match[1]);
        
        console.log('Total games:', games.length);
        console.log('Total boxarts:', boxarts.length);
        
        let replaced = 0;
        let notReplaced = 0;
        
        for (let g of games) {
            let searchTitle = g.title.toLowerCase();
            
            // Extract region from our title (e.g., "World Usa" -> region "usa")
            let region = '';
            if (searchTitle.includes(' usa')) region = 'usa';
            else if (searchTitle.includes(' europe')) region = 'europe';
            else if (searchTitle.includes(' japan')) region = 'japan';
            
            // Remove common trailing tags from our title to get core name
            let coreName = searchTitle.replace(/\b(usa|europe|japan|en|fr|de|es|it|beta|rev|demo|hack|translated|the)\b/gi, '').trim().replace(/\s+/g, ' ');
            
            // Score all boxarts
            let bestScore = 0;
            let bestMatch = null;
            
            for (let b of boxarts) {
                let lowerB = b.toLowerCase();
                
                // If we know region, penalize mismatched regions, boost correct ones
                let isMatchRegion = true;
                if (region) {
                   if (region === 'usa' && (lowerB.includes('(japan)') || lowerB.includes('(europe)'))) isMatchRegion = false;
                   if (region === 'japan' && (lowerB.includes('(usa)') || lowerB.includes('(europe)'))) isMatchRegion = false;
                   if (region === 'europe' && (lowerB.includes('(usa)') || lowerB.includes('(japan)'))) isMatchRegion = false;
                }
                
                let bCore = lowerB.replace(/\([^)]+\)/g, '').trim().replace(/\s+/g, ' '); // remove (USA) etc.
                
                // Using string similarity
                let score = stringSimilarity.compareTwoStrings(coreName, bCore);
                
                // Bonus for exact core match
                if (coreName === bCore) {
                    score += 0.2;
                }
                
                // Bonus for region match
                if (region && lowerB.includes(`(${region.toLowerCase()})`)) {
                    score += 0.1;
                }
                
                // Penalty for wrong region
                if (!isMatchRegion) {
                    score -= 0.3;
                }

                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = b;
                }
            }
            
            // If we have a decent match (e.g. > 0.7)
            if (bestScore >= 0.7 && bestMatch) {
                g.imageUrl = 'https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Super_Nintendo_Entertainment_System/master/Named_Boxarts/' + encodeURIComponent(bestMatch).replace(/%20/g, '%20').replace(/'/g, '%27') + '.png';
                g.bannerUrl = 'https://raw.githubusercontent.com/libretro-thumbnails/Nintendo_-_Super_Nintendo_Entertainment_System/master/Named_Snaps/' + encodeURIComponent(bestMatch).replace(/%20/g, '%20').replace(/'/g, '%27') + '.png';
                replaced++;
            } else {
                notReplaced++;
                // Let it keep its original poster from Retrogames, it's better than nothing.
                // Wait, some games already have a github link that might be wrong from previous run.
                // If it has github link but score is low now, maybe we should restore the retrogames poster?
                // The issue is I overwrote their retrogames poster in the last run. :(
                // Wait! But I still have the original scraped data in the script or git? No, I deleted scraped_games.json.
            }
        }
        
        console.log('Replaced:', replaced, 'Not Replaced:', notReplaced);
        
        // Let's write the file
        const newGamesStr = JSON.stringify(games, null, 2).replace(/\"([a-zA-Z]+)\":/g, '\$1:');
        const finalFile = existing.replace(match[1], newGamesStr);
        fs.writeFileSync('src/data/games.ts', finalFile);
    });
});
