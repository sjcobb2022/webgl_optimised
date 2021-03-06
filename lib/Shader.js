import {
    FLOAT,
    FLOAT_MAT2,
    FLOAT_MAT3,
    FLOAT_MAT4,
    FLOAT_VEC2,
    FLOAT_VEC3, FLOAT_VEC4,
    FRAGMENT_SHADER, INT_VEC2, INT_VEC3, INT_VEC4, SAMPLER_2D, SAMPLER_CUBE, UNSIGNED_INT,
    VERTEX_SHADER
}                               from "./util/constants.mjs";
import {arr_diff, generateUUID} from "./util/utilities.mjs";

class Shader{
    constructor(vs, fs) {

        this.children = [];

        this.info = {}

        this.vs = vs;
        this.fs = fs;

        this.program = undefined;

        this.needsInit = true;
        this.uuid = generateUUID();

        this.registeredGeom = [];

    }

    init(gl){
        const program = gl.createProgram();

        const vert = this.compile(VERTEX_SHADER, this.vs, gl);
        const frag = this.compile(FRAGMENT_SHADER, this.fs, gl);

        gl.attachShader(program, vert);
        gl.attachShader(program, frag);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw "Unable to initialize the shader program: " + gl.getProgramInfoLog(program);
        }

        gl.detachShader(program, vert);
        gl.detachShader(program, frag);

        gl.deleteShader(vert);
        gl.deleteShader(frag);

        this.programInfo(program, gl);

        this.program = program;
        console.log(this);
    }

    programInfo(program, gl){
        let uni  = {};
        let attr = {};
        let smpl = {};


        for (let i = 0; i < gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS); i++) {

            let data = gl.getActiveUniform(program, i);

            if (!data) break;

            let name = data.name;
            let type = data.type;

            if (type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) smpl[name] = type;

            let typeFunction = this.getDataFunc(data, gl);

            let matrix = false;

            if (type === gl.FLOAT_MAT2 || type === gl.FLOAT_MAT3 || type === gl.FLOAT_MAT4)
                matrix = true;

            let TYPE_LENGTH            = {};
            TYPE_LENGTH[gl.FLOAT]      = TYPE_LENGTH[gl.INT] = TYPE_LENGTH[gl.BYTE] = TYPE_LENGTH[gl.BOOL] = 1;
            TYPE_LENGTH[gl.FLOAT_VEC2] = TYPE_LENGTH[gl.INT_VEC2] = TYPE_LENGTH[gl.BOOL_VEC2] = 2;
            TYPE_LENGTH[gl.FLOAT_VEC3] = TYPE_LENGTH[gl.INT_VEC3] = TYPE_LENGTH[gl.BOOL_VEC3] = 3;
            TYPE_LENGTH[gl.FLOAT_VEC4] = TYPE_LENGTH[gl.INT_VEC4] = TYPE_LENGTH[gl.BOOL_VEC4] = 4;
            TYPE_LENGTH[gl.FLOAT_MAT3] = 9;
            TYPE_LENGTH[gl.FLOAT_MAT4] = 16;

            let dataTypeLength = TYPE_LENGTH[data.type] || 1;

            uni [name] = {
                func       : typeFunction,
                type       : type,
                type_length: dataTypeLength,
                size       : data.size,
                matrix     : matrix,
                location   : gl.getUniformLocation(program, name),
                data       : new Float32Array(dataTypeLength * data.size), //FROM liteGL - ASSIGN SPACE BEFORE HAND MORE DATA EFFICIENT
                required   : false,
            };
        }

        for (let i = 0; i < gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES); ++i) {
            let data = gl.getActiveAttrib(program, i);

            if (!data) break;

            attr[data.name] = gl.getAttribLocation(program, data.name);
        }

        this.info = {uni, attr, smpl}
    }

    getDataFunc(data, gl){
        let func;
        let INT;
        switch (data.type) {
            case FLOAT:
                if (data.size === 1)
                    func = gl.uniform1f;
                else
                    func = gl.uniform1fv;
                break;

            case FLOAT_MAT2:
                func = gl.uniformMatrix2fv;
                break;

            case FLOAT_MAT3:
                func = gl.uniformMatrix3fv;
                break;

            case FLOAT_MAT4:
                func = gl.uniformMatrix4fv;
                break;

            case FLOAT_VEC2:
                func = gl.uniform2fv;
                break;

            case FLOAT_VEC3:
                func = gl.uniform3fv;
                break;

            case FLOAT_VEC4:
                func = gl.uniform4fv;
                break;

            case UNSIGNED_INT:
            case INT:
                if (data.size === 1)
                    func = gl.uniform1i;
                else
                    func = gl.uniform1iv;
                break;
            case INT_VEC2:
                func = gl.uniform2iv;
                break;
            case INT_VEC3:
                func = gl.uniform3iv;
                break;
            case INT_VEC4:
                func = gl.uniform4iv;
                break;

            case SAMPLER_2D:
            case SAMPLER_CUBE:
                func = gl.uniform1i;
                break;
            default:
                func = gl.uniform1f;
                break;
        }
        return func;
    }

    compile(type, source, gl){
        let shader = gl.createShader(type);
        // console.log(shader);
        gl.shaderSource(shader, source);

        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            throw "SHADER DID NOT COMPILE";
        }

        return shader;
    }

    addChild(mesh){
        if(mesh.isMesh){
            // console.log(mesh);
            this.registerGeom(mesh);
            this.children.push(mesh);
        } else {
            console.warn(`shader children must be intance of mesh`)
        }
    }

    registerGeom(mesh_or_geom){
        let geom;
        if(mesh_or_geom.isMesh === true){
            geom = mesh_or_geom.geom;
        }
        else if (mesh_or_geom.isGeom === true){
            geom = mesh_or_geom;
        } else {
            throw `Can only register Geometry or Meshes Geometry into shader`;
        }
        if(this.registeredGeom.includes(geom.uuid)) return;

        console.log('register geo, this should only run once')

        const object_attr_length = Object.keys(geom.attributes).length;
        const comparison_obj = Object.assign({}, geom.attributes, this.info.attr);
        //
        const comparison_obj_length = Object.keys(comparison_obj).length;
        //
        if (comparison_obj_length > object_attr_length) {

            if (geom.indexed === true) {

                const initial_array = arr_diff(Object.keys(geom.attributes), Object.keys(this.info.attr));

               // only get undefined props
                const final_array = initial_array.filter(x => geom.attributes[x] === undefined);

                throw `Object does not have properties: ${final_array}`;

            }

            else {
                throw `Object does not have properties: ${arr_diff(geom.attributes.keys(), this.info.attr.keys())}`;
            }

        } else {
            this.registeredGeom.push(geom.uuid);
        }

    }

}

Shader.prototype.isShader = true;

export {Shader};