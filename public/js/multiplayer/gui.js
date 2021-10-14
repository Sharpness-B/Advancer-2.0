// exit multiplayer
document.getElementById("buttonHome").onclick = function() {
    musicCheck();
    location.href = "/"; 
}

// exit menu
document.getElementById("buttonGame").onclick = function()  {document.getElementById("section_multiplayer_overlay").style.display = "none"}
document.getElementById("game_canvas").onclick = function() {document.getElementById("section_multiplayer_overlay").style.display = "none"}

// show menu
document.addEventListener("keydown", function(e) {
    if (e.key=="Escape") document.getElementById("section_multiplayer_overlay").style.display = "grid";
});