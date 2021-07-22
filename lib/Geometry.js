import {ARRAY_BUFFER, ELEMENT_ARRAY_BUFFER, STATIC_DRAW} from "./util/constants.mjs";
import {generateUUID}                                    from "./util/utilities.mjs";

class Geometry{

    constructor(){

        this.attributes = {};
        this.buffers = {};

        this.uuid = generateUUID();

        this._vertices = [];
        this._indices = [];
        this._uvs = [];
        this._normals = [];

        this.attributeStride = 0;

        this.needsBuffers = true;
        this.indexed = false;

        this.registeredShaders = [];

    }

    set vertices(data){
        if(Array.isArray(data)){
            this._vertices = data;
        } else {
            throw `Position data must be array`
        }
    }

    set indices(data){
        if(Array.isArray(data)){
            this._indices = data;
        } else {
            throw `Indices data must be array`
        }
    }

    set uvs(data){
        if(Array.isArray(data)){
            this._uvs = data;
        } else {
            throw `UVS data must be array`
        }
    }

    set normals(data){
        if(Array.isArray(data)){
            this._normals = data;
        } else {
            throw `Normals data must be array`
        }
    }

    addAttribute(name, data, size, index = false) {
        this.attributes[name] = {data, size, index};
    }

    initBuffers(gl){
        const interleavedBufferData = this.interleaveAttributes();

        const buffer = gl.createBuffer();

        gl.bindBuffer(ARRAY_BUFFER, buffer);

        gl.bufferData(ARRAY_BUFFER, new Float32Array(interleavedBufferData), STATIC_DRAW); //DYNAMIC_DRAW

        this.buffers.mainBuffer = buffer;
        // console.log(this.buffers);

        if(this.indexed === true){

            let indexAttribute = Object.entries(this.attributes).find(element => element[1].index === true);

            const buffer = gl.createBuffer();

            gl.bindBuffer(ELEMENT_ARRAY_BUFFER, buffer);

            gl.bufferData(ELEMENT_ARRAY_BUFFER, new Uint16Array(indexAttribute[1].data), STATIC_DRAW); //DYNAMIC????

            this.buffers.indexBuffer = buffer;

        }


        //OLD CODE, very innefficnet because stored in seperate buffers, storing in single buffer more effective because

        // for (let key in this.attributes) {
        //
        //     if (!this.attributes.hasOwnProperty(key)) continue;
        //
        //     const buffer = gl.createBuffer();
        //
        //     if (this.attributes[key].index === true) {
        //
        //         gl.bindBuffer(ELEMENT_ARRAY_BUFFER, buffer);
        //
        //         gl.bufferData(ELEMENT_ARRAY_BUFFER, new Uint16Array(this.attributes[key].data), STATIC_DRAW);
        //
        //     }
        //
        //     else {
        //
        //
        //         gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        //
        //         gl.bufferData(ARRAY_BUFFER, new Float32Array(this.attributes[key].data), STATIC_DRAW);
        //
        //
        //     }
        //
        //     this.buffers[key] = buffer;
        //
        // }
    }

    registerShader(shader){

    }

    shaderInit(vertString, UVString, NormalString) {

        this.addAttribute(vertString, this._vertices, 3);
        this.addAttribute(UVString, this._uvs, 2);
        this.addAttribute(NormalString, this._normals, 3);
        this.addAttribute("indices", this._indices, 0, true);

    }

    interleaveAttributes(){

        let attrib_lengths = [];

        for(let key in this.attributes){

            if(!this.attributes.hasOwnProperty(key)) continue;

            const attrib = this.attributes[key];

            if(attrib.index === true) continue;

            attrib_lengths.push([attrib.data.length / attrib.size, key]);
        }

        //probs can do somewhere else but will do here for now
        let offset = 0;
        for (let i = 0; i < attrib_lengths.length; i++) {
            this.attributes[attrib_lengths[i][1]].offset = offset;
            offset += this.attributes[attrib_lengths[i][1]].size * 4;
        }

        this.attributeStride = offset;

        //IF ALL VALUES ARE EQUAL!!!!
        let buffer_arr = [];
        if( attrib_lengths.every((val, i, arr) => val[0] === arr[0][0])){

            for (let i = 0; i < attrib_lengths[0][0]; i++) {

                for (let j = 0; j < attrib_lengths.length; j++) {
                    let attrib_key = this.attributes[attrib_lengths[j][1]];

                    for (let k = 0; k < attrib_key.size; k++) {
                        const dataToPush = attrib_key.data[(i * attrib_key.size) + k]
                        buffer_arr.push(dataToPush);
                    }

                }

            }

        }
        else {
            //maybe do a check????
            throw `some attribute is not the proper length`;
        }

        return buffer_arr;
    }
}

Geometry.prototype.isGeom = true;

class CubeGeometry extends Geometry{
    constructor(positionString = "aPosition", UVString = "aTextureCoord", NormalString = "aNormal") {
        super();

        this.indexed = true;

        this.vertices = [
            // Front face
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,

            // Top face
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, 1.0,
            -1.0, -1.0, 1.0,

            // Right face
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0,
        ];

        this.uvs = [
            // Front
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Back
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Top
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Bottom
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Right
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Left
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
        ];

        this.indices =  [
            0, 1, 2, 0, 2, 3,    // front
            4, 5, 6, 4, 6, 7,    // back
            8, 9, 10, 8, 10, 11,   // top
            12, 13, 14, 12, 14, 15,   // bottom
            16, 17, 18, 16, 18, 19,   // right
            20, 21, 22, 20, 22, 23,   // left
        ];

        this.normals = [
            // Front
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,

            // Back
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,

            // Top
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,

            // Bottom
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,

            // Right
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,

            // Left
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0
        ];

        this.shaderInit(positionString, UVString, NormalString);
    }
}

export {Geometry, CubeGeometry}