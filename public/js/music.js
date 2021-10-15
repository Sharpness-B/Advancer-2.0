/* MUSIC */

const audioElement = new Audio('media_assets/music1.mp3');
audioElement.volume = 1;

// toggle volume
const buttonToggleVolume = document.getElementById("buttonToggleVolume");

function updateButtonInnerHTML() {
    if (audioElement.volume > 0) buttonToggleVolume.innerHTML = "🔇";
    else                         buttonToggleVolume.innerHTML = "🔊";
}
buttonToggleVolume.onclick = function() {
    if (audioElement.volume > 0) audioElement.volume = 0;
    else                         audioElement.volume = 1;
    
    updateButtonInnerHTML()
}

// read cookie if set - if comming from different page
let musicRead  = cookie.readCookie('music');
let volumeRead = cookie.readCookie('volume');
if (musicRead)  audioElement.currentTime = parseInt(musicRead );
if (volumeRead) audioElement.volume      = parseInt(volumeRead);

// if volume>0: try to play music imidiatly, if failure - try again on interaction with the page
if (audioElement.volume > 0) audioElement.play();
document.body.onclick = function () {
    if (audioElement.volume > 0) audioElement.play();
};

// set the cookie `music` to `audioElement.currentTime` on page chagne (button click gui.js)
function musicCheck() {
    cookie.createCookie('music',  audioElement.currentTime, 10);
    cookie.createCookie('volume', audioElement.volume,       10);
}

// set button text
updateButtonInnerHTML()