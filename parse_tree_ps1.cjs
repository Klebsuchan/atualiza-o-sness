const fs = require('fs');
const data = JSON.parse(fs.readFileSync('repo_tree_ps1.json', 'utf8'));
const boxarts = data.tree.filter(item => item.path.startsWith('Named_Boxarts/') && item.path.endsWith('.png')).map(item => item.path.replace('Named_Boxarts/', ''));
fs.writeFileSync('boxarts_ps1.txt', boxarts.join('\n'));
console.log(boxarts.slice(0, 10));
