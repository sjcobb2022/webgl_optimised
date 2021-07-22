import {mat4, quat, vec3} from "../matrix/gl-matrix.js";
import {generateUUID}     from "./util/utilities.mjs";

let _v3 = vec3.create();
let _m4 = mat4.create();
let _q = quat.create();

let _xA = vec3.fromValues(1, 0, 0);
let _yA = vec3.fromValues(0, 1, 0);
let _zA = vec3.fromValues(0, 0, 1);


class core {

    constructor() {

        this.model = mat4.create();
        this.normal =

        this.uuid = generateUUID();

        this.needsModelUpdate = false;

        this.needsBuffers = true;

        this._position = vec3.create();

        this._rotation = quat.create();

        this._scale = vec3.fromValues(1, 1, 1);

        this.uniforms = {};
        this.buffers = {};
    }

    transformMat4(mat) {
        mat4.mul(this.model, this.model, mat);
        mat4.getTranslation(this._position, this.model);
        mat4.getScaling(this._scale, this.model);
        mat4.getRotation(this._rotation, this.model);
    }

    setScale(x, y, z) {
        mat4.scale(this.model, this.model, [x, y, z])
    }

    translate(x, y, z) {
        mat4.translate(this.model, this.model, [x, y, z]);
    }

    rotateX(rad) {
        mat4.rotate(this.model, this.model, rad, _xA)
        this.needsModelUpdate = true;
    }

    rotateY(rad){
        mat4.rotate(this.model, this.model, rad, _yA)
        this.needsModelUpdate = true;

    }

    rotateZ(rad){
        mat4.rotate(this.model, this.model, rad, _zA)
        this.needsModelUpdate = true;
    }

    rotate(rad, axis){
        mat4.rotate(this.model, this.model, rad, axis);
    }

    updateModelMatrix() {
        // mat4.fromRotationTranslationScale(this.model, this._rotation, this._position, this._scale);
    }

    onModelUpdate(){

    }

    fromRotationTranslationScale(rotation, translation, scale){
        mat4.fromRotationTranslationScale(this.model, rotation, translation, scale);
    }

    set position(pos) {
        // this._position        = vec3;
        mat4.getTranslation(_v3, this.model);
        vec3.sub(_v3, pos, _v3);
        mat4.translate(this.model, this.model, _v3);
        this.needsModelUpdate = true;
    }

    get position() {
        mat4.getTranslation(_v3, this.model)
        return _v3;
    }

    set rotation(rot) {
        mat4.fromQuat(_m4, rot);
        mat4.mul(this.model, this.model, _m4);
        this.needsModelUpdate = true;
    }

    get rotation(){
        mat4.getRotation(_q, this.model);
        return _q;
    }

    set scale(scale) {
        mat4.scale(this.model, this.model, scale);
        this.needsModelUpdate = true;
    }

    get scale() {
        mat4.getScaling(_v3, this.model)
        return _v3;
    }

    setUniform(name, data) {
        this.uniforms[name] = data;
    }
}

export {core}