import {mat4, vec3} from "../../matrix/gl-matrix.js";

function arr_diff (a1, a2) {

    let a = [], diff = [];

    for (let i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (let i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (let k in a) {
        diff.push(k);
    }

    return diff;
}

const _lut = [];

for (let i = 0; i < 256; i++) {

    _lut[i] = (i < 16 ? '0' : '') + (i).toString(16);

}

function generateUUID() {

    const d0   = Math.random() * 0xffffffff | 0;
    const d1   = Math.random() * 0xffffffff | 0;
    const d2   = Math.random() * 0xffffffff | 0;
    const d3   = Math.random() * 0xffffffff | 0;
    const uuid = _lut[d0 & 0xff] + _lut[d0 >> 8 & 0xff] + _lut[d0 >> 16 & 0xff] + _lut[d0 >> 24 & 0xff] + '-' +
                 _lut[d1 & 0xff] + _lut[d1 >> 8 & 0xff] + '-' + _lut[d1 >> 16 & 0x0f | 0x40] + _lut[d1 >> 24 & 0xff] + '-' +
                 _lut[d2 & 0x3f | 0x80] + _lut[d2 >> 8 & 0xff] + '-' + _lut[d2 >> 16 & 0xff] + _lut[d2 >> 24 & 0xff] +
                 _lut[d3 & 0xff] + _lut[d3 >> 8 & 0xff] + _lut[d3 >> 16 & 0xff] + _lut[d3 >> 24 & 0xff];

    // .toUpperCase() here flattens concatenated strings to save heap memory space.
    return uuid.toUpperCase();

}

export {arr_diff, generateUUID}

function print_mat4(matrix){

    let string = "";

    for(let i = 0; i<16; i+=4){

        string += matrix[i].toString() + " " + matrix[i + 1].toString()+ " " + matrix[i + 2].toString()+ " " + matrix[i + 3].toString() + "\n";

    }

    console.log(string);

}

let mat = [1, 0, 0, 0, 0, 0.80901700258255, 0.5877852439880371, 0, 0, -0.5877852439880371, 0.80901700258255, 0, 0, 0, 0, 1];

// print_mat4(mat);

// console.log(mat[8],mat[9],mat[10] );



function getMinMaxPoints(vertArray, model){

    let transformedVerts = [];

    for(let i=0; i < vertArray.length; i+=3) {
        const vertPos = vec3.fromValues(vertArray[i], vertArray[i + 1], vertArray[i + 2]);

        let transformedPos = vec3.transformMat4(vec3.create(), vertPos, model)  /* vec3.add(vec3.create(), vertPos, translation);*/

        transformedVerts.push(transformedPos[0], transformedPos[1], transformedPos[2]);
    }

    let min = vec3.fromValues(Infinity, Infinity, Infinity);
    let max = vec3.fromValues(-Infinity, -Infinity, -Infinity);

    //get min max
    if (transformedVerts.length !== 0) for (let i = 0; i < transformedVerts.length; i += 3) {

        let x = transformedVerts[i];
        let y = transformedVerts[i + 1];
        let z = transformedVerts[i + 2];

        let minX = Math.min(min[0], x);
        let minY = Math.min(min[1], y);
        let minZ = Math.min(min[2], z);

        let maxX = Math.max(max[0], x);
        let maxY = Math.max(max[1], y);
        let maxZ = Math.max(max[2], z);

        vec3.set(min, minX, minY, minZ);

        vec3.set(max, maxX, maxY, maxZ);
    }
    else {
        throw `vertices not set`;
    }

    //MIN MAX POINTS TIME

    return [min, max];
}


export {getMinMaxPoints}