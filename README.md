# Advancer, a deadly serious 3d multiplayer game.
So, as I don't like uncompleted projects, I decided to continue the development of Advancer.

I'm incredibly happy with how this turned out - it's a 3d multiplayer game with a custom 3d library and it fricings works; it's smooth too!!!! 

I would like to forward a big thanks to [Kiran](https://github.com/Vaakir) and [Jacob](https://github.com/raSKTypeShit) for the great effort in Advancer 1.0 - when it was a school project! The challenge was to build a 3d space shooter game without a 3d engine library. So, in 1.0 we developed a story for the game, designed some spaceships and the ux, but most importantly coded our 3d engine (Jacob had the main responsibility and delivered an absolutely stunning result).

Now, in Advancer 2.0 users are automatically fingerprinted, logged in, and registered in firestore. I've improved upon the 3d engine.

You can of course blast your friends with space bullets (multiplayer), and purchase upgrades with gold that you earn by spending time in the game. I have spent a fair amount of time working on the movements of the spaceships, so make sure to show off some crazy acrobatics! 

Can you figure out what acrobatics that make you earn gold?

#### Tech stack:
 - our own 3d engine
 - node.js
 - express-fingerprint
 - socket.io
 - firebase

# Demo
![multiplayer](https://github.com/Sharpness-B/Advancer-2.0/blob/main/marketing_assets/multiplayer.gif?raw=true)
![gameplay](https://github.com/Sharpness-B/Advancer-2.0/blob/main/marketing_assets/main.gif?raw=true)
![upgrades](https://github.com/Sharpness-B/Advancer-2.0/blob/main/marketing_assets/upgrades.gif?raw=true)

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
