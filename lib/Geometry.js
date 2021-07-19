import {ARRAY_BUFFER, ELEMENT_ARRAY_BUFFER, STATIC_DRAW} from "../util/constants.mjs";

class Geometry{

    constructor(){

        this.attributes = {};
        this.buffers = {};

        this._vertices = [];
        this._indices = [];
        this._uvs = [];
        this._normals = [];

        this.needsBuffers = true;
        this.indexed = true;

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
        for (let key in this.attributes) {

            if (!this.attributes.hasOwnProperty(key)) continue;

            const buffer = gl.createBuffer();

            if (this.attributes[key].index === true) {

                gl.bindBuffer(ELEMENT_ARRAY_BUFFER, buffer);

                gl.bufferData(ELEMENT_ARRAY_BUFFER, new Uint16Array(this.attributes[key].data), STATIC_DRAW);

            }

            else {


                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

                gl.bufferData(ARRAY_BUFFER, new Float32Array(this.attributes[key].data), STATIC_DRAW);


            }

            this.buffers[key] = buffer;

        }
    }

    shaderInit(vertString, UVString, NormalString) {

        this.addAttribute(vertString, this._vertices, 3);
        this.addAttribute(UVString, this._uvs, 2);
        this.addAttribute(NormalString, this._normals, 3);
        this.addAttribute("indices", this._indices, 0, true);
    }
}

class CubeGeometry extends Geometry{
    constructor(positionString = "aPosition", UVString = "aTextureCoord", NormalString = "aNormal") {
        super();

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