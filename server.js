const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const firebaseConfig = require('./modules/db/config');

const login = require('./modules/db/login');
const handle_transaction = require('./modules/db/handle_transaction');
const add_gold = require('./modules/db/add_gold');
const get_user_count = require('./modules/db/get_user_count')

const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);

const express = require('express');
const app = express();
const http = require('http');
const httpServer = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(httpServer, {cors: { origin: "*" }});

const game = require('./modules/multiplayer/game');

const fingerprint = require('express-fingerprint');
const session = require('express-session');

const port = process.env.PORT || 3000;



app.use(session({
    secret: "ssshhhhhh",
    resave: true,
    saveUninitialized: true
}));

app.use(fingerprint({
    parameters: [
        fingerprint.useragent,
        fingerprint.acceptHeaders,
        fingerprint.geoip
    ]
}));

app.use(express.static(__dirname + '/public'));




let sess; // global session, NOT recommended

app.get('/', (req, res) => {
    sess=req.session;
    const fp = req.fingerprint;
    sess.fp = fp.hash;

    login(firestore, fp.hash, JSON.stringify(fp)).then(balances => {
        sess.balances = balances;
        console.log('---> login complete', balances);
    });

    res.sendFile(__dirname + '/public/html/homepage.html');
});

// handle purchase
app.post('/transaction/:upgrade', (req, res) => {
    const upgrade = req.params.upgrade;

    handle_transaction(firestore, upgrade, sess.fp, sess.balances).then(balances => {
        sess.balances = balances;
        res.json(balances);
    });
});

// endpoint for fetching levels
app.post('/get_balances', (req, res) => {
    // loops every 0.25 seconds until user is logged in and sess.balances is defined
    (function wait_until_logged_in(){
        if (typeof sess/*.balances*/ !== "undefined") {
            if (typeof sess.balances !== "undefined") {
                res.json(sess.balances);
            }
            else {
                setTimeout(wait_until_logged_in, 250);
            }
        }
        else {
            setTimeout(wait_until_logged_in, 250);
        }
    }())
});



app.get('/multiplayer', (req, res) => {
    sess=req.session;
    const fp = req.fingerprint;
    sess.fp = fp.hash;

    login(firestore, fp.hash, JSON.stringify(fp)).then(balances => {
        sess.balances = balances;
        console.log('---> login complete', balances);

        res.sendFile(__dirname + '/public/html/multiplayer.html');
    });
});

// endpoint for adding gold to wallets
app.post('/add_gold', (req, res) => {
    // loops every 0.25 seconds until user is logged in and sess.balances is defined
    (function wait_until_logged_in(){
        if (typeof sess/*.balances*/ !== "undefined") {
            if (typeof sess.fp !== "undefined" || typeof sess.balances !== "undefined") {
                add_gold(firestore, 30, sess.fp, sess.balances).then(balances => {
                    sess.balances = balances;
                    res.json(balances);
                });
            }
            else {
                setTimeout(wait_until_logged_in, 250);
            }
        }
        else {
            setTimeout(wait_until_logged_in, 250);
        }
    }())
});



// for readme
app.get('/user_count', (req, res) => {
    get_user_count(firestore).then(count => {
        const spcae = "&#10240;"
        const text = `${spcae}Unique users: ${count}${spcae}`;
        const bg_color = "#41c8c8"

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="466.65" height="60.16" style="border-bottom: 4px solid ${bg_color}">
            <defs>
                <filter x="0" y="0" width="1" height="1" id="solid">
                    <feFlood flood-color="${bg_color}" result="bg" />
                    <feMerge>
                        <feMergeNode in="bg"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <text filter="url(#solid)" x="0" y="50" font-size="50" margin-bottom="5" font-family="'Ubuntu',Tahoma,'Helvetica Neue',Helvetica,Arial,sans-serif">${text}</text>
        </svg>`

        res.set({
            'Content-Type': 'image/svg+xml',
            'Cache-control': 'no-cache'
        });
        res.send(svg)
    })
})



game(io);



httpServer.listen(port, () => {
    console.log(`Advancer, a deadly serious multiplayer game. Check it out at http://localhost:${port}/`);
});