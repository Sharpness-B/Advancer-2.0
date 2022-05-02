Deployment: [https://advancer20.herokuapp.com](https://advancer20.herokuapp.com)

Code: [https://github.com/Sharpness-B/Advancer-2.0](https://github.com/Sharpness-B/Advancer-2.0)

![user count](https://advancer20.herokuapp.com/user_count)

# Advancer
### a multiplayer 3d space shooter game with a custom graphics engine!
So, as I don't like uncompleted projects, I decided to continue the development of Advancer.

I'm incredibly happy with how this turned out - it's a 3d multiplayer game with a custom 3d library and it fricings works; it's smooth too!!!! 

I would like to forward a big thanks to [Kiran](https://github.com/Vaakir) and [Jacob](https://github.com/raSKTypeShit) for the great effort in Advancer 1.0 - when it was a school project! The challenge was to build a 3d space shooter game without a 3d engine library. So, in 1.0 we developed a story for the game, designed some spaceships and the ux, but most importantly coded our 3d engine (Jacob had the main responsibility and delivered an absolutely stunning result).

Now, in Advancer 2.0 users are automatically fingerprinted, logged in, and registered in firestore. I've improved upon the 3d engine, and added controls to the 3d objects. The app is automatically deployd to [herokuapp.com](https://advancer20.herokuapp.com/) on every push to the github repo.

You can of course blast your friends with space bullets (multiplayer), and purchase upgrades with gold that you earn doing acrobatics in the game. I have spent a fair amount of time working on the movements of the spaceships, so make sure to show off some crazy acrobatics! 

Can you figure out what acrobatics that make you earn gold?

#### Tech stack:
 - our own 3d engine `public/js/libraries/flyengine & math`
 - node.js
 - express-fingerprint
 - socket.io
 - firebase

# Demo
Demo video: [https://www.youtube.com/watch?v=vgNRxaLQzAA](https://www.youtube.com/watch?v=vgNRxaLQzAA)

![multiplayer](https://github.com/Sharpness-B/Advancer-2.0/blob/main/marketing_assets/multiplayer.gif?raw=true)
![gameplay](https://github.com/Sharpness-B/Advancer-2.0/blob/main/marketing_assets/main.gif?raw=true)
![upgrades](https://github.com/Sharpness-B/Advancer-2.0/blob/main/marketing_assets/upgrades.gif?raw=true)

# How to set up locally
Set up a firebase with a web app and a firestore - remember to allow read and write.

Get the code `git clone https://github.com/Sharpness-B/Advancer-2.0.git`

Cd into the root directory `cd Advancer-2.0`

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
