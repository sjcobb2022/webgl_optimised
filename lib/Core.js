import {mat4, quat, vec3} from "../matrix/gl-matrix.js";

class core {
    constructor() {

        this.model = mat4.create();

        this.needsModelUpdate = false;

        this.needsBuffers = true;

        this._position = vec3.create();

        this._rotation = quat.create();

        this._scale = vec3.fromValues(1, 1, 1);

        this.attributes = {};
        this.uniforms = {};
        this.buffers = {};

        this.indexed = false;

    }

    transformMat4(mat) {
        mat4.mul(this.model, this.model, mat);

        mat4.getTranslation(this._position, this.model);
        mat4.getScaling(this._scale, this.model);
        mat4.getRotation(this._rotation, this.model);
    }

    setScale(x, y, z) {
        vec3.mul(this._scale, this._scale, vec3.fromValues(x, y, z));
        this.needsModelUpdate = true;
    }

    translate(x, y, z) {
        // mat4.translate(this.model, this.model, [x, y, z]);
    }

    rotateRad(x, y, z) {
        quat.rotateX(this._rotation, this._rotation, x);
        quat.rotateY(this._rotation, this._rotation, y);
        quat.rotateZ(this._rotation, this._rotation, z);
        this.needsModelUpdate = true;
    }

    updateModelMatrix() {
        mat4.fromRotationTranslationScale(this.model, this._rotation, this._position, this._scale);
    }

    set position(data) {
        this._position        = data;
        this.needsModelUpdate = true;
    }

    get position() {
        return this._position;
    }

    set rotation(data) {
        this._rotation        = data;
        this.needsModelUpdate = true;
    }

    set scale(data) {
        this._scale           = data;
        this.needsModelUpdate = true;
    }

    get scale() {
        return this._scale;
    }

    addUniform(name, data) {
        this.uniforms[name] = data;
    }
}

export {core}