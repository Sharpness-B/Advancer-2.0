/* MUSIC */

// let loc = document.location.href.split('/');
var audioElement = new Audio('media_assets/music1.mp3');

// read cookie if set - if comming from different page
c = cookie.readCookie('music');
if (c) {
    audioElement.currentTime = c;
}

// try to play music imidiatly, if failure - try again on interaction with the page
audioElement.play();
document.body.onclick = function () {
    audioElement.play();
};

// set the cookie `music` to `audioElement.currentTime` on page chagne (button click gui.js)
function musicCheck() {
    if (cookie.readCookie('music')) {
        cookie.eraseCookie('music');
    }
    cookie.createCookie('music',audioElement.currentTime,10);
}