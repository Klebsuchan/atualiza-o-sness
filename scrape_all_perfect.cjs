const fs = require('fs');
const https = require('https');
const stringSimilarity = require('string-similarity');

const letters = ['number', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

function fetchPage(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', () => resolve(''));
    });
}

function cleanTitle(urlStr) {
    const file = urlStr.split('/').pop().replace('.html', '');
    return file.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

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

async function scrapeLetter(l) {
    let allGames = [];
    let page = 1;
    let maxPage = 1;
    while (page <= maxPage) {
        let url = `https://www.retrogames.cc/snes-games/${l}/page/${page}.html`;
        if (page === 1) url = `https://www.retrogames.cc/snes-games/${l}/index.html`;
        
        const data = await fetchPage(url);
        
        if (page === 1) {
            let snippet = data.match(/<ul[^>]*pagination[^>]*>([\s\S]*?)<\/ul>/i);
            if (snippet) {
                let pageLinks = snippet[1].match(/page\/(\d+)\.html/g);
                if (pageLinks) {
                    for (let p of pageLinks) {
                        let num = parseInt(p.match(/\d+/)[0]);
                        if (num > maxPage) maxPage = num;
                    }
                }
            }
        }
        
        const matchBlocks = data.match(/data-poster=\"([^\"]+)\"[\s\S]*?href=\"(https:\/\/www\.retrogames\.cc\/snes-games\/[^\"]+\.html)\"/g);
        if (!matchBlocks) break;
        
        for (let match of matchBlocks) {
            const poster = match.match(/data-poster=\"([^\"]+)\"/)[1];
            const link = match.match(/href=\"([^\"]+)\"/)[1];
            const titleStr = link.split('/').pop().replace('.html', '');
            
            let id = '';
            const posterIdMatch = poster.match(/\/(\d+)_/);
            if (posterIdMatch) {
                id = posterIdMatch[1];
            } else {
                continue;
            }
            
            allGames.push({
                title: titleStr,
                niceTitle: cleanTitle(titleStr),
                id: id,
                poster: poster
            });
        }
        page++;
    }
    return allGames;
}

const chunkArg = process.argv[2] || "1";
let selectedLetters = [];
if (chunkArg === "1") selectedLetters = ['number', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
else if (chunkArg === "2") selectedLetters = ['j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's'];
else if (chunkArg === "3") selectedLetters = ['t', 'u', 'v', 'w', 'x', 'y', 'z'];
else selectedLetters = letters;

async function main() {
    console.log('Scraping chunk', chunkArg, '...');
    
    let scrapedGames = [];
    for (let l of selectedLetters) {
        const games = await scrapeLetter(l);
        scrapedGames.push(...games);
    }
    
    console.log('Total scraped from retrogames.cc for chunk:', scrapedGames.length);
    fs.writeFileSync(`chunk_${chunkArg}.json`, JSON.stringify(scrapedGames));
    console.log(`Saved chunk_${chunkArg}.json`);
}
main();
