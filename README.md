# Advancer, a deadly serious multiplayer game.

So, as I don't like uncompleted projects, I decided to continue the development of Advancer.

I'm really happy with how this turned out, and would like to forward a big thanks to Kiran and Jacob for the great effort in Advancer 1.0 - when it was a school project! The challenge was to build a 3d space shooter game without a 3d engine library. So, in 1.0 we developed a story for the game, designed some spaceships and the ux, but most importantly coded our 3d engine (Jacob had the main responsibility and delivered an absolutely stunning result).

Now, in Advancer 2.0 users are automatically fingerprinted, logged in, and registered in firestore.

You can of course lazer your friends (multiplayer), and flex your spaceship that you can upgrade with the game currency that you earn by spending time in grinding mode (singleplayer).

Tech stack:
 - our own 3d engine
 - node.js
 - express-fingerprint
 - socket.io
 - firebase


# Demo


# How to set up locally
Set up a firebase and a firestore - remember to allow read and write.

Create a .env with the firebase web app config. The file should be in the root directory looking something like this:
                
```.env
firebase_apiKey=aaaaaaaaaaaaaaaaaaaaaaaaaaa
firebase_authDomain=advancer-79c5c.firebaseapp.com
firebase_projectId=advancer-79c5c
firebase_storageBucket=advancer-79c5c.appspot.com
firebase_messagingSenderId=401690015200
firebase_appId=1:401690015200:web:ec6754703d49dbe0bb2785
firebase_measurementId=G-M70N2JX0ZD
```

`npm install`

`npm start`