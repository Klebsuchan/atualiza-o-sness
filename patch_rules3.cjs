const fs = require('fs');
let rules = fs.readFileSync('firestore.rules', 'utf8');

const target = `      match /friends/{friendId} {
        allow read, write: if isSignedIn() && userId == request.auth.uid;
      }`;
      
const replacement = `      match /friends/{friendId} {
        allow read, write: if isSignedIn() && userId == request.auth.uid;
      }
      
      match /invitations/{invitationId} {
        allow read: if isSignedIn() && userId == request.auth.uid;
        allow create: if isSignedIn();
        allow delete, update: if isSignedIn() && userId == request.auth.uid;
      }`;
      
rules = rules.replace(target, replacement);
fs.writeFileSync('firestore.rules', rules);
