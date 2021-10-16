const socket = io();

  /////////////////
 // chat & logs //
/////////////////
const ulChat = document.getElementById("ulChat");
const inputTextChat = document.getElementById("inputTextChat");
const buttonSendChat = document.getElementById("buttonSendChat");


// recive
function scrollChatToBottom() {
    const elem = document.getElementById('ulChat');
    elem.scrollTop = elem.scrollHeight;
}
socket.on('message', message => {
    const li = document.createElement("li");
    li.innerHTML = `<p>${message}</p>`;
    ulChat.appendChild(li);
    scrollChatToBottom();
});
socket.on('logs', message => {
    const li = document.createElement("li");
    li.innerHTML = `<pre>${message}</pre>`;
    ulChat.appendChild(li);
    scrollChatToBottom();
});


// send
function sendMessage() {
    message = inputTextChat.value;
    inputTextChat.value = "";
    socket.emit('message', message);
}
addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage()
    }
});
buttonSendChat.onclick = sendMessage;



  //////////
 // game //
//////////
const client_id = uuidv4();

// make client_id joinable with socket.id => if (player.client_id === client_id)
socket.on('connect', () => {
    socket.emit('storeClientInfo', { id: client_id, ship:{} });
});



// game dimensions
const width  = 1920;
const height = 1080;

const canvas  = document.getElementById("game_canvas");
canvas.height = height;
canvas.width  = width;

const ctx     = canvas.getContext("2d");
ctx.translate(width/2, height/2);

// styling: make sure that height or width is maximised with the correct aspect ratio
function maximizeWithAndHeight() {
    if (innerHeight>height || innerWidth>width) {
        const aspectRatio = width/height;
        if (innerHeight*aspectRatio < innerWidth) {
            canvas.style.height = innerHeight.toString() + "px";
            canvas.style.width  = "auto";
        }
        else {
            canvas.style.height = "auto";
            canvas.style.width  = innerWidth .toString() + "px";
        }
    }
}
maximizeWithAndHeight();
window.addEventListener('resize', maximizeWithAndHeight);



// registrer and send keyboard events
document.addEventListener('keydown', (e) => {
    socket.emit('keydown', e.key);
});

document.addEventListener('keyup', (e) => {
	socket.emit('keyup', e.key);
});

// draw game on new frame
function drawFrame(data) {
    window.scale = ctx.canvas.width/2;

    // get this users camera to recreate the camera object - becuse: (looses method in io emit)
    const you = data.players.find(player => player.client_id === client_id);
    window.cam = new Camera(
        new vec3(
            you.camera.position.x,
            you.camera.position.y,
            you.camera.position.z
        ),
        new vec3(
            you.camera.direction.x,
            you.camera.direction.y,
            you.camera.direction.z
        ),
        you.camera.fov,
        you.camera.near,
        you.camera.far,

        you.camera.rotation,
        you.camera.tiltation
    );

    // light
    window.light = data.lights[0];


      //////////
     // draw //
    //////////

    // clear screen
    ctx.clearRect(-ctx.canvas.width/2, -ctx.canvas.height/2, ctx.canvas.width, ctx.canvas.height);

    // draw jets
    data.players.forEach(player => {
        DrawModel(player.jet);
    });

    // draw comets
    data.comets.forEach(comet => {
        DrawModel(comet);
    });
}



// listen for new frame
socket.on('frame', data => drawFrame(data) );





// class Simple2dGame {
//     constructor(ctx) {
//         this.ctx = ctx;
//     }
//     draw(data) {
//         this.ctx.clearRect(0, 0, width, height);
//
//         data.forEach(player => {
//             if (player.client_id === client_id) this.ctx.fillStyle = "purple";
//             else                                this.ctx.fillStyle = "red";
//
//             this.ctx.beginPath();
//             this.ctx.arc(player.x, player.y, 50, 0, 2 * Math.PI);
//             this.ctx.fill();
//         });
//     }
// }
// const game = new Simple2dGame(ctx);
// socket.on('frame', data => game.draw(data) );