const {figure, illumination} = require('./../../public/js/libraries/flyengine/modelsConstructor');
const Camera                 = require('./../../public/js/libraries/flyengine/Camera');
const vec3                   = require('./../../public/js/libraries/math/vec3');


class Player {
    constructor(x,y,z,id,client_id) {
        this.id = id; 
        this.client_id = client_id;

        this.jet = new figure("crabWing", undefined, new vec3(x,y,z), 3);
        this.jet.rotate(Math.random()*Math.PI*2)

        this.camera = new Camera(   new vec3(0.0, 100.0, 100.0), // Pos
                                    new vec3(0.0, -1.0, -1.0),  // Dir
                                    1.6, 1.0, -5.0);           // FOV, near, far
        
        this.keys = {
            "w":     false,
            "a":     false,
            "s":     false,
            "d":     false,    
            " ":     false,
            "Shift": false,
            "Enter": false,
        }

        if (players.length==1) {
            this.test = "jj"
        }
    }
}



// commets, lights and bullets
const lights = [new illumination("upgradesLight", new vec3(100, 100, 0), 0.5)];
const commets = [
    new figure("icosahedron", undefined, new vec3( 5,   40,   0),  3),
    new figure("icosahedron", undefined, new vec3( 20,  0,    10), 2),
    new figure("icosahedron", undefined, new vec3( 50,  30,   0),  5),
    new figure("icosahedron", undefined, new vec3( 60, -30,   20), 3),
    new figure("icosahedron", undefined, new vec3( 0,   0,    10), 0.5),
    new figure("icosahedron", undefined, new vec3(-90,  20,  -30), 25),
    new figure("icosahedron", undefined, new vec3(-50,  0,    20), 1.5),
    new figure("icosahedron", undefined, new vec3(-20, -30,   20), 15),
];

let bullets = [];

commets.forEach(c => {
    c.rotate(Math.random()*Math.PI*2)
    c.tilt  (Math.random()*Math.PI*2)
})


// registry of players and socket ids
let players = [];
let socketID = [];


// move, accellerate and jerk (derivative of accel) - return object describing the frame
function update() {
    const movement_scale = 8
    players.forEach(player => {
        if      (player.keys.a && !player.keys.d) player.jet.rotate(-0.01*movement_scale);
        else if (player.keys.d && !player.keys.a) player.jet.rotate( 0.01*movement_scale);

        if      (player.keys.w && !player.keys.s) player.jet.tilt(-0.01*movement_scale);
        else if (player.keys.s && !player.keys.w) player.jet.tilt( 0.01*movement_scale);

        if      (player.keys[" "])  player.jet.accelerate(-0.01*movement_scale);
        else if (player.keys.Shift) player.jet.translateTo(new vec3(0,0,0));

        // shoot bullet
        if (player.keys.Enter) {
            const bullet = player.jet.shoot();
            bullet.frames_left = 100;
            bullet.speed = -5;
            bullets.push( bullet );
        }

        player.jet.moveForvard()
    })

    bullets.forEach(bullet => {
        bullet.frames_left --;
        bullet.moveForvard(resistance=0)
    });

    bullets = bullets.filter(bullet => bullet.frames_left > 0);

    return {
        players: players,
        comets: commets,
        lights: lights,
        bullets: bullets
    }
}


function game(io) {
    io.on('connection', (socket) => {

        // join client id with socket.id, and add ship
        socket.on('storeClientInfo', (client_data,ship) => {
            const you = new Player(0,0,0, socket.id, client_data.id);

            if (!socketID.includes(you.id)) {
                socketID.push(you.id);
                players.push(you);
            }

            console.log(socket.id, "has connected", 
                        "\nnumber of players:", socketID.length.toString());

            // log in chat
            io.emit('logs', `${socket.id} has connected<br>number of players: ${socketID.length.toString()}`);
        });
        

    
        // recive and send chat message
        socket.on('message', (message) =>     {
            if (message!="") {
                const text = `${socket.id.substring(0,2)} says: ${message}`;
                console.log(text);
                io.emit('message', text);  
            }
        });
    

    
        // write key events to correct user
        socket.on('keydown', (key) => {
            const player = players.find(p => p.id === socket.id);

            if (["w", "a", "s", "d", " ", "Shift", "Enter"].includes(key)) {
                player.keys[key] = true;
            }
        });

        socket.on('keyup', (key) => {
            const player = players.find(p => p.id === socket.id);
            
            if (["w", "a", "s", "d", " ", "Shift", "Enter"].includes(key)) {
                player.keys[key] = false;
            }
        });



        // handle disconnection
        socket.on('disconnect', () => {
            socketID = socketID.filter(id => id !== socket.id);
            players  = players .filter(player => player.id !== socket.id);

            console.log(socket.id, "has disconnected", 
                        "\nnumber of players:", socketID.length.toString());

            // log in chat
            io.emit('logs', `${socket.id} has disconnected<br>number of players: ${socketID.length.toString()}`);
        });
    }); 

    

    // game loop
    const FRAME_RATE = 40;

    const intervalId = setInterval(() => {
        data = update();
        
        io.sockets.emit("frame", data);
    }, 1000 / FRAME_RATE);
}

module.exports = game;