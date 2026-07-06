const fs = require('fs');
let content = fs.readFileSync('src/data/ps1Games.ts', 'utf8');

const regex = /"title":\s*"([^"]+)",[\s\S]*?"imageUrl":\s*"([^"]+)",\s*"bannerUrl":\s*"([^"]+)"/g;

let count = 0;
while(regex.exec(content)) {
  count++;
}
console.log(`Found ${count} matches`);
