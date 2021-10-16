function DrawModel(model) {
    // calculate the center of the faces and arrange array in correct order to be sorted
    let faceCenters = [];
    for(let f = 0; f < model.face.length; f++)
    {
        // Calculate COM(center of mass)
        let pc = vec3.add(vec3.add(model.vert[model.face[f][0]], model.vert[model.face[f][1]]), model.vert[model.face[f][2]]);
        pc.divide(3);   // pc: polygon center (current face's center)
        let element = [...model.face[f]];
        
        // Take away color object to put it back later so z positions are in the same place in all face elements
        if(element.length > 3)
        {
            element.pop();
        }
        element.push(pc.z);     // Append the faces COM to face element

        if(model.face[f].length > 3)
        {
            element.push(model.face[f][3]);     // Add back color element if it was present before
        }

        faceCenters.push(element);      // Add final face element to list of faces with added z-value
    }

    // Sort faces by Z-distance
    faceCenters.sort(function (a, b) { return a[3] - b[3]; });

    // Project all vertex positions to 2d and append to modelScreen
    let modelScreen = new Array();
    for(let v = 0; v < model.vert.length; v++)
    {
        modelScreen.push(cam.project(vec3.add(model.vert[v], model.pos)));
    }


    for(let f = 0; f < faceCenters.length; f++)
    {
        /* Backface culling */
        let v = vec3.subtract(modelScreen[faceCenters[f][1]].tov3(model.vert[faceCenters[f][1]].z), modelScreen[faceCenters[f][0]].tov3(model.vert[faceCenters[f][0]].z));
        let u = vec3.subtract(modelScreen[faceCenters[f][2]].tov3(model.vert[faceCenters[f][2]].z), modelScreen[faceCenters[f][0]].tov3(model.vert[faceCenters[f][0]].z));
        let N = vec3.cross(v, u); // Surface (N)ormal

        if(N.z >= 0) { continue; }      // cull the backfaces

        /* Ambient lighting */

        let ambLum = 0.2;

        /* Diffusion lighting */

        //let pc = vec3.add(vec3.add(model.vert[model.face[f][0]], model.vert[model.face[f][1]]), model.vert[model.face[f][2]]);

        let pc = vec3.add(vec3.add(model.vert[faceCenters[f][0]], model.vert[faceCenters[f][1]]), model.vert[faceCenters[f][2]]);
        pc.divide(3);   // pc: polygon center (current face's center)

        let vl = vec3.subtract(light.pos, vec3.add(pc, model.pos)); // vector from pc to light source

        N.normalize();      // Normalize bot vectors
        vl.normalize();     // so to be used for dotproduct

        let difLum = vec3.dot(N, vl);    // 0-1 value luminance mulitplier

        /* Set color luminance */

        if(difLum < 0) { difLum = 0; }

        let luminance = ambLum + difLum;

        if(faceCenters[f].length > 4)
        {
            ctx.fillStyle = "rgb(" + faceCenters[f][4].r*luminance + ", " + faceCenters[f][4].g*luminance + ", " + faceCenters[f][4].b*luminance + ")"; // Change luminance of face with given color
        }
        else
        {
            ctx.fillStyle = "rgb(" + model.color.r*luminance + ", " + model.color.g*luminance + ", " + model.color.b*luminance + ")"; // Change luminance of face if no face color is given
        }

        ctx.beginPath();

        ctx.moveTo(scale*modelScreen[faceCenters[f][0]].x, scale*modelScreen[faceCenters[f][0]].y);
        ctx.lineTo(scale*modelScreen[faceCenters[f][1]].x, scale*modelScreen[faceCenters[f][1]].y);
        ctx.lineTo(scale*modelScreen[faceCenters[f][2]].x, scale*modelScreen[faceCenters[f][2]].y);
        ctx.lineTo(scale*modelScreen[faceCenters[f][0]].x, scale*modelScreen[faceCenters[f][0]].y);
        ctx.fill();
    }
}