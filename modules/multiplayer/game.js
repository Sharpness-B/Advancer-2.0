const {figure, illumination} = require('./../../public/js/libraries/flyengine/modelsConstructor');
const Camera                 = require('./../../public/js/libraries/flyengine/Camera');


class Player {
    constructor(x,y,z,id,client_id) {
        this.id = id; 
        this.client_id = client_id;

        this.jet = new figure("crabWing", undefined, new vec3(x,y,z), 1);

        this.camera = new Camera(   new vec3(0.0, 100.0, 100.0), // Pos
                                    new vec3(0.0, -1.0, -1.0),  // Dir
                                    1.6, 1.0, -5.0);           // FOV, near, far
        
        this.keys = {
            "w":     false,
            "a":     false,
            "s":     false,
            "d":     false,    
            " ":     false,
            "Shift": false
        }

        if (players.length==1) {
            this.test = "jj"
        }
    }
}



// commets and lights
const lights = [new illumination("upgradesLight", new vec3(-2, 2, -3), 0.5)];
const commets = [];



// move, accellerate and jerk (derivative of accel) - return object describing the frame
function update(players,cnt) {
    players.forEach(player => {
        if      (player.keys.a && !player.keys.d) player.jet.rotate(-0.05);
        else if (player.keys.d && !player.keys.a) player.jet.rotate( 0.05);

        if      (player.keys.w && !player.keys.s) player.jet.tilt(-0.05);
        else if (player.keys.s && !player.keys.w) player.jet.tilt( 0.05);

        if      (player.keys[" "])  player.jet.accelerate(-0.05);
        else if (player.keys.Shift) player.jet.translateTo(new vec3(0,0,0));

        player.jet.moveForvard()
    })

    return {
        players: players,
        comets: commets,
        lights: lights
    }
}



// registry of players and socket ids
let players = [];
let socketID = [];

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

            if (["w", "a", "s", "d", " ", "Shift"].includes(key)) {
                player.keys[key] = true;
            }
        });

        socket.on('keyup', (key) => {
            const player = players.find(p => p.id === socket.id);
            
            if (["w", "a", "s", "d", " ", "Shift"].includes(key)) {
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
    const FRAME_RATE = 20
    let cnt = 0

    const intervalId = setInterval(() => {
        data = update(players,cnt++);
        
        io.sockets.emit("frame", data);
    }, 1000 / FRAME_RATE);
}

module.exports = game;