# Advancer, a deadly serious multiplayer game.


#### Tech stack:
 - our own 3d engine
 - node.js
 - express-fingerprint
 - socket.io
 - firebase

# Demo


# How to set up locally
Set up a firebase with a web app and a firestore - remember to allow read and write.

Create a .env with the firebase web app config. The file should be in the root directory looking something like this:
                
```.env
firebase_apiKey = aaaaaaaaaaaaaaaaaaaaaaaaaaa
firebase_authDomain = advancer-79c5c.firebaseapp.com
firebase_projectId = advancer-79c5c
firebase_storageBucket = advancer-79c5c.appspot.com
firebase_messagingSenderId = 401690015200
firebase_appId = 1:401690015200:web:ec6754703d49dbe0bb2785
firebase_measurementId = G-M70N2JX0ZD
```

Then `npm install`

And finally `npm start`
