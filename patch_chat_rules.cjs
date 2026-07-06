const fs = require('fs');
let rules = fs.readFileSync('firestore.rules', 'utf8');

const target = `      match /games/{gameId} {`;
const replacement = `      match /chats/{sessionId}/messages/{messageId} {
        allow read, write: if isSignedIn();
      }
      
      match /games/{gameId} {`;

rules = rules.replace(target, replacement);
fs.writeFileSync('firestore.rules', rules);
