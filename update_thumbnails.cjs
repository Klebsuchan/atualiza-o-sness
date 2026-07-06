const fs = require('fs');
const stringSimilarity = require('string-similarity');

const boxarts = fs.readFileSync('boxarts.txt', 'utf8').split('\n').filter(Boolean);
const baseUrl = "https://raw.githubusercontent.com/libretro-thumbnails/Sega_-_Mega_Drive_-_Genesis/master/Named_Boxarts/";

// Function to clean game title for matching
function cleanTitle(title) {
  return title.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const cleanedBoxarts = boxarts.map(filename => {
  const nameOnly = filename.replace(/\s*\([^)]*\)/g, '').replace('.png', '').trim();
  
  // Score for sorting preference
  let score = 0;
  if (filename.includes('(USA)')) score += 10;
  if (filename.includes('(USA, Europe)')) score += 15;
  if (filename.includes('(World)')) score += 20;
  if (filename.includes('(Virtual Console)')) score -= 50;
  if (filename.includes('(Beta)')) score -= 50;
  if (filename.includes('(Rev')) score -= 5;
  
  return {
    filename,
    nameOnly,
    clean: cleanTitle(nameOnly),
    score
  };
});

function findBestMatch(gameTitle) {
  const targetClean = cleanTitle(gameTitle);
  
  let candidates = cleanedBoxarts.filter(b => b.clean === targetClean);
  
  if (candidates.length === 0) {
    const matches = stringSimilarity.findBestMatch(targetClean, cleanedBoxarts.map(b => b.clean));
    if (matches.bestMatch.rating > 0.8) {
      const bestClean = cleanedBoxarts[matches.bestMatchIndex].clean;
      candidates = cleanedBoxarts.filter(b => b.clean === bestClean);
    }
  }
  
  if (candidates.length > 0) {
    // Sort by score descending
    candidates.sort((a, b) => b.score - a.score);
    return encodeURI(baseUrl + candidates[0].filename).replace(/#/g, '%23');
  }
  
  return null;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;

  const regex = /title:\s*"([^"]+)",[\s\S]*?imageUrl:\s*"([^"]+)",\s*bannerUrl:\s*"([^"]+)"/g;
  
  content = content.replace(regex, (match, title, imgUrl, banUrl) => {
    const bestUrl = findBestMatch(title);
    if (bestUrl) {
      updated = true;
      return match.replace(imgUrl, bestUrl).replace(banUrl, bestUrl);
    }
    return match;
  });

  if (updated) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

// Reset files first since we might have overwritten them with bad data
require('child_process').execSync('git checkout src/data/sega_games.ts src/data/ssega_games_part1.ts src/data/ssega_games_part2.ts || true');

processFile('src/data/sega_games.ts');
processFile('src/data/ssega_games_part1.ts');
processFile('src/data/ssega_games_part2.ts');
