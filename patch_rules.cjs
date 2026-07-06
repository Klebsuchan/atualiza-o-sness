const fs = require('fs');
let rules = fs.readFileSync('firestore.rules', 'utf8');

// Change user read
rules = rules.replace(
  'allow read: if isSignedIn() && userId == request.auth.uid;',
  'allow read: if isSignedIn();'
);

// Add friends match
const friendsRule = `
      match /friends/{friendId} {
        allow read: if isSignedIn() && userId == request.auth.uid;
        allow list: if isSignedIn() && userId == request.auth.uid;
        allow create: if isSignedIn() && userId == request.auth.uid && isValidId(friendId);
        allow update, delete: if isSignedIn() && userId == request.auth.uid;
      }

      match /games/{gameId} {`;

rules = rules.replace('match /games/{gameId} {', friendsRule);

fs.writeFileSync('firestore.rules', rules);
