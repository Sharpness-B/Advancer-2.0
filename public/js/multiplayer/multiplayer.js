const socket = io();

  /////////////////
 // chat & logs //
/////////////////
const ulChat = document.getElementById("ulChat");
const inputTextChat = document.getElementById("inputTextChat");
const buttonSendChat = document.getElementById("buttonSendChat");

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

socket.on('connect', () => {
    socket.emit('storeClientInfo', { id: client_id, ship:{} });
});

const width  = 1920;
const height = 1080;


class Game {
    constructor(ctx) {
        this.ctx = ctx;
    }
    draw(data) {
        this.ctx.clearRect(0, 0, width, height);

        data.forEach(player => {
            if (player.client_id === client_id) this.ctx.fillStyle = "purple";
            else                                this.ctx.fillStyle = "red";

            this.ctx.beginPath();
            this.ctx.arc(player.x, player.y, 50, 0, 2 * Math.PI);
            this.ctx.fill();
        });
    }
}



const canvas  = document.getElementById("game_canvas");
const ctx     = canvas.getContext("2d");
ctx.translate(width/2, height/2);
canvas.height = height;
canvas.width  = width;


document.addEventListener('keydown', (e) => {
    socket.emit('keydown', e.key);
});

document.addEventListener('keyup', (e) => {
	socket.emit('keyup', e.key);
});



const game = new Game(ctx);

socket.on('frame', data => game.draw(data) );