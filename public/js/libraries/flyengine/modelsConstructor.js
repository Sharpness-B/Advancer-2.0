// if node environment
if (typeof process === "object" && typeof require === "function") {
    global.vec3 = require("./../math/vec3");
    global.Matrix = require("./../math/Matrix");

    const models = require("./../flyengine/models");
    global.figures = models.figures;
    global.lights  = models.lights;
}



class illumination {
    constructor(type, pos, strength) {
        this.vert  = lights[type].vert;
        this.face  = lights[type].face;
        this.pos      = (typeof pos      == "undefined") ? lights[type].pos      : pos;
        this.strength = (typeof strength == "undefined") ? lights[type].strength : strength;
    }
}

class figure {
    constructor(type, color, pos, scalar) {
        this.vert  = figures[type].vert;
        this.face  = figures[type].face;
        this.color = (typeof color == "undefined") ? figures[type].color : color;
        this.pos   = (typeof pos   == "undefined") ? figures[type].pos   : pos;
        this.dir   = (typeof dir   == "undefined") ? figures[type].dir   : dir;
        this.rotation = 0;
        this.tiltation = 0;

        this.acceleration = 0;
        this.speed = 0;

        this.strength = figures[type].strength; // for lys

        if (scalar) this.scale(scalar);
    }

    scale(scalar) {
        for (let i=0;  i<this.vert.length; i++) {
            this.vert[i].x *= scalar;
            this.vert[i].y *= scalar;
            this.vert[i].z *= scalar;
        }
    }

    translateTo(vec) {
        this.rotate(-this.rotation);
        this.tilt  (-this.tiltation);

        const difference = vec3.subtract(vec, this.vert[this.vert.length-1]);

        this.translateBy(difference);
    }

    translateBy(vec) {
        for (let i=0;  i<this.vert.length; i++) {
            this.vert[i] = vec3.add(this.vert[i], vec)
        }
    }

    accelerate(jerk) {
        this.acceleration += jerk
    }

    moveForvard(resistance=0.02) {
        const R = resistance * (this.speed**2)
        
        if (this.acceleration <= 0) {this.acceleration += R}
        else                        {this.acceleration=0;}

        this.speed += this.acceleration;

        let move = new vec3(0,0,this.speed)
        move.transform(Matrix.rotateY(this.rotation))
        move.transform(Matrix.rotateX(this.tiltation))

        this.translateBy(move);
    }

    rotate(radians, shoulTilt=true) {
        const origin = new vec3(0,0,0);

        const figCenter = new vec3(
            this.vert[this.vert.length-1].x,
            this.vert[this.vert.length-1].y,
            this.vert[this.vert.length-1].z
        )
        const difference = vec3.subtract(figCenter, origin)

        const tiltation = parseFloat(this.tiltation)

        for(let v = 0; v < this.vert.length; v++) {
            this.vert[v] = vec3.subtract(this.vert[v], difference);
        }
        if (shoulTilt) {
            this.tilt(-tiltation, false)
        }
        for(let v = 0; v < this.vert.length; v++) {
            this.vert[v].transform(Matrix.rotateY(radians));
        }
        if (shoulTilt){
            this.tilt(tiltation, false)
        }
        for(let v = 0; v < this.vert.length; v++) {
            this.vert[v] = vec3.add(this.vert[v], difference);
        }

        this.rotation += radians
    }

    tilt(radians, shoulRotate=true) {
        const origin = new vec3(0,0,0);

        const figCenter = new vec3(
            this.vert[this.vert.length-1].x,    
            this.vert[this.vert.length-1].y,
            this.vert[this.vert.length-1].z
        )

        const difference = vec3.subtract(figCenter, origin)

        const rotation = parseFloat(this.rotation);

        for(let v = 0; v < this.vert.length; v++) {
            this.vert[v] = vec3.subtract(this.vert[v], difference);
        }
        if (shoulRotate) {
            this.tilt(-rotation, false)
        }
        for(let v = 0; v < this.vert.length; v++) {
            this.vert[v].transform(Matrix.rotateX(radians));
        }
        if (shoulRotate){
            this.tilt(rotation, false)
        }
        for(let v = 0; v < this.vert.length; v++) {
            this.vert[v] = vec3.add(this.vert[v], difference);
        }

        this.tiltation += radians;
    }
}



// if node environment
if (typeof process === "object" && typeof require === "function") {
    module.exports = {figure, illumination};
}