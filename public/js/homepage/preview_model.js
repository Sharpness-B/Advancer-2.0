let canvasPreview = document.getElementById("canvasPreview");
canvasPreview.width = 600;
canvasPreview.height = 600;
let ctx = canvasPreview.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.translate(ctx.canvas.width/2, ctx.canvas.height/2);
ctx.font = "40px Courier";
ctx.globalAlpha = 0.6;

let scale = ctx.canvas.width/2;

let rotY = 0;
let rotX = 0;

let fps = 0;
let drawFps = 0;
let dt_old = 0; 

let intervalFpsCounter = setInterval(function() { drawFps = fps; }, 200);

let cam = new Camera(   new vec3(0.0, 80.0, -10.0), // Pos
                        new vec3(0.0, -40, -1.0), // Dir
                        1.6, 1.0, -5.0);          // FOV, near, far

let light = new illumination("upgradesLight", new vec3(-30, 70, -30), 0.5);
let jet = new figure("crabWing", undefined, new vec3(0.0, 0.0, 0.0), 5);
jet.translateBy(new vec3(0.0, 40.0, 0.0))
jet.tilt(Math.PI)

jet.tilt(Math.PI/2)

let rotate = true;
let tilt = false;

function main()
{
    let dt = performance.now() - dt_old;
    ctx.fillStyle = "white";
    fps = Math.round(1000 / dt);
    dt_old = performance.now();
    
    if (rotate) jet.rotate(0.01);
    if (tilt)   jet.tilt(0.02);
    

    ctx.clearRect(-ctx.canvas.width/2, -ctx.canvas.height/2, ctx.canvas.width, ctx.canvas.height);

    DrawModel(jet);

    ctx.fillStyle = "white";
    ctx.fillText(drawFps, -ctx.canvas.width/2, -ctx.canvas.height/2 + 30);

    requestAnimationFrame(main);
}
main();
