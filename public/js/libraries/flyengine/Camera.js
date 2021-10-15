class Camera
{
    fov;
    near;
    far;
    position;
    direction;
    facingZ;
    
    constructor(position, direction, fov, near, far)
    {
        this.fov = fov;
        this.near = near;
        this.far = far;
        this.position = position;
        this.direction = direction;
        this.facingZ = direction.z > 0;
        this.rotation = 0;
        this.tiltation = 0;
    }

    get viewMatrix()
    {
        return([
            [1/Math.tan(this.fov/2), 0, 0,                   0],
            [0, 1/Math.tan(this.fov/2), 0,                   0], 
            [0, 0, (this.far+this.near)/(this.far-this.near),       -1],
            [0, 0, (2 * this.far * this.near)/(this.far-this.near),  0]
        ]);
    }

    get cameraMatrix()
    {
        let p = this.position;
        let d = {...this.direction};

        // (T)ranslate to origin
        let T = [   [   1,    0,    0,    0],
                [   0,    1,    0,    0],
                [   0,    0,    1,    0],
                [-1*p.x, -1*p.y, -1*p.z,    1]   ];

        // (R)otate so -z is forward
        let theta = Math.atan(d.x/d.z);
        let Ry = [      [   Math.cos(theta),                  0,    Math.sin(theta),                  0],
                        [                 0,                  1,                  0,                  0],
                        [-1*Math.sin(theta),                  0,    Math.cos(theta),                  0],
                        [                 0,                  0,                  0,                  1]    ];;
        
        let phi = Math.atan(d.y/Math.sqrt( d.x**2 + d.z**2 ));
        
        let Rx = [  [                 1,                  0,                  0,                  0],
                    [                 0,    Math.cos(  phi), -1*Math.sin(  phi),                  0],
                    [                 0,    Math.sin(  phi),    Math.cos(  phi),                  0],
                    [                 0,                  0,                  0,                  1]    ];

        // Combination of Rx and Ry to R
        let R = Matrix.multiply(Rx, Ry);
        
        // (C)ameraMatrix
        let C = Matrix.multiply(T, R);
        return(C);
    }

    project(vec)
    {
        let C = this.cameraMatrix;
        let V = this.viewMatrix;
        let CV = Matrix.multiply(C, V);

        let p4 = Matrix.multiply(Matrix.v3tom(vec), CV); // Egentlig bytte CV og Matrix.v3tom(vec)
        
        let w = p4[0][3];
        
        let p3 = new vec3(p4[0][0]/w,
                          p4[0][1]/w,
                          p4[0][2]/w);

        return new vec2(p3.x/p3.z, p3.y/p3.z);
    }



    translateBy(vec) {
        this.position = vec3.add(this.position, vec)
    }

    move(distance) {
        let move = new vec3(0,0,distance)
        move.transform(Matrix.rotateY(this.rotation))
        move.transform(Matrix.rotateX(this.rotation))

        this.translateBy(move);
    }

    rotate(radians) {
        this.direction.transform(Matrix.rotateY(radians));
        this.rotation += radians;
    }

    tilt(radians) {
        this.direction.transform(Matrix.rotateX(radians));
        this.tiltation += radians;
    }
}