class Player {
    constructor(x,y,id,client_id) {
        this.id = id; 
        this.client_id = client_id;

        this.x = x
        this.y = y

        this.vx = 0;
        this.vy = 0;

        this.ax = 0;
        this.ay = 0;

        this.w = false;
        this.a = false;
        this.s = false;
        this.d = false;        
    }

    move() {
        this.vx += this.ax;
        this.vy += this.ay;

        this.x += this.vx;
        this.y += this.vy;
    }
}

function update(players) {
    return players.map(player => {
        if      (player.a && !player.d) player.ax -= 1;
        else if (player.d && !player.a) player.ax += 1;
        else                            player.ax = 0;

        if      (player.w && !player.s) player.ay -= 1;
        else if (player.s && !player.w) player.ay += 1;
        else                            player.ay = 0;
        
        
        player.vx += player.ax;
        player.x  += player.vx;

        player.vy += player.ay;
        player.y  += player.vy;

        return player;
    })
}

let players = [];
let socketID = [];

function game(io) {
    io.on('connection', (socket) => {

        socket.on('storeClientInfo', (client_data) => {
            const you = new Player(0,0, socket.id, client_data.id);

            if (!socketID.includes(you.id)) {
                socketID.push(you.id);
                players.push(you);
            }

            console.log(socket.id, "has connected", 
                        "\nnumber of players:", socketID.length.toString());

            io.emit('logs', `${socket.id} has connected <br> number of players: ${socketID.length.toString()}`);
        });
        


    
        // for testing / chat
        socket.on('message', (message) =>     {
            const text = `${socket.id.substring(0,2)} says: ${message}`;
            console.log(text);
            io.emit('message', text);   
        });
    

    
        socket.on('keydown', (key) => {
            const player = players.find(p => p.id === socket.id);
            
            if (["w", "a", "s", "d"].includes(key)) {
                player[key] = true;
            }
        });



        socket.on('keyup', (key) => {
            const player = players.find(p => p.id === socket.id);
            
            if (["w", "a", "s", "d"].includes(key)) {
                player[key] = false;
            }
        });



        socket.on('disconnect', () => {
            socketID = socketID.filter(id => id !== socket.id);
            players  = players .filter(player => player.id !== socket.id);

            console.log(socket.id, "has disconnected", 
                        "\nnumber of players:", socketID.length.toString());

            io.emit('logs', `${socket.id} has disconnected <br> number of players: ${socketID.length.toString()}`);
        });
    }); 


    const FRAME_RATE = 30

    const intervalId = setInterval(() => {
        data = update(players);
        io.sockets.emit("frame", data);
    }, 1000 / FRAME_RATE);
}

module.exports = game;