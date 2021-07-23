import {mat4, quat, vec3} from "../matrix/gl-matrix.js";
import {generateUUID}     from "./util/utilities.mjs";

let _v3 = vec3.create();
let _m4 = mat4.create();
let _q  = quat.create();

let _xA = vec3.fromValues(1, 0, 0);
let _yA = vec3.fromValues(0, 1, 0);
let _zA = vec3.fromValues(0, 0, 1);


class core {

    constructor() {

        this._model  = mat4.create();
        this._normal = mat4.transpose(mat4.create(), mat4.invert(mat4.create(), this.model));


        // this.worldMatrix = this._model;

        this.bindings = {
            model : undefined,
            normal: undefined,
        };

        this.uuid = generateUUID();

        this.needsModelUpdate = false;
        // this.needsWorldUpdate = false;

        this.needsBuffers = true;

        this.uniforms = {};
        this.buffers  = {};

        this.children = [];
        this.parent   = undefined;

        this.calledWorldUpdate = false;

    }

    //WORKING WITH child parent relationships
    // add(child) {
    //
    //     if (arguments > 1) {
    //
    //         for (let i = 0; i < arguments.length; i++) {
    //
    //             this.add(arguments[i]);
    //
    //         }
    //
    //         return this;
    //     }
    //
    //     if (Array.isArray(child)) {
    //
    //         for (let i = 0; i < child.length; i++) {
    //
    //             this.add(child[i]);
    //
    //         }
    //
    //         return this;
    //     }
    //
    //     if (child === this) {
    //
    //         console.error('Object cannot be child of self');
    //
    //     }
    //
    //     if (child && child.isCore) {
    //
    //         if (child.parent !== null) {
    //
    //             child.parent.remove(child);
    //
    //         }
    //
    //         child.parent = this;
    //
    //         this.children.push(child);
    //
    //
    //     }
    //     else {
    //
    //         console.error('Object must be instance of core');
    //
    //     }
    //
    //     return this;
    // }

    // remove(child) {
    //
    //     if (arguments > 1) {
    //
    //         for (let i = 0; i < arguments.length; i++) {
    //
    //             this.remove(arguments[i]);
    //
    //         }
    //
    //         return this;
    //     }
    //
    //     if (Array.isArray(child)) {
    //
    //         for (let i = 0; i < child.length; i++) {
    //
    //             this.remove(child[i]);
    //
    //         }
    //
    //         return this;
    //     }
    //
    //     const index = this.children.indexOf(child);
    //
    //     if (index !== -1) {
    //
    //         child.parent = null;
    //         this.children.splice(index, 1);
    //
    //     }
    //
    //     return this;
    //
    // }

    // removeFromParent() {
    //
    //     const parent = this.parent;
    //
    //     if (parent !== null) {
    //
    //         parent.remove(this);
    //
    //     }
    //
    //     return this;
    // }

    // update(force) {
    //     //update model?
    //     // this.updateModelNormal();
    //
    //     if (this.needsWorldUpdate || force) {
    //
    //         if (this.parent && this.parent.isCore) {
    //
    //             if(this.needsModelUpdate){
    //
    //                 this.model = mat4.multiply(this.model, this.parent.model, this.model);
    //
    //             }
    //
    //         }
    //
    //         this.needsWorldUpdate = false;
    //
    //
    //     }
    //
    //     const children = this.children;
    //
    //     for (let i = 0; i < children.length; i++) {
    //         children[i].update(force);
    //     }
    //
    // }

    //only update necessary branches
    // callWorldUpdate(parents = true, children = true) {
    //
    //     this.needsWorldUpdate = true;
    //
    //     if (parents === true) {
    //         if (this.parent && this.parent.isCore) {
    //             this.parent.callWorldUpdate(true, false);
    //         }
    //     }
    //
    //     if(children === true){
    //
    //         if(this.children.length > 0){
    //
    //             const children = this.children;
    //
    //             for(let i=0;i<children.length;i++){
    //
    //                 if(children[i].isCore){
    //
    //                     children[i].callWorldUpdate(false, true);
    //
    //                 }
    //
    //             }
    //
    //         }
    //
    //     }
    //
    // }

    //WORKING WITH 3D STUFFS
    set model(data) {
        this._model = data;

        if(! this.calledWorldUpdate){
            // this.callWorldUpdate(true, true);
        }

    }

    get model() {
        return this._model;
    }

    transformMat4(mat) {
        mat4.mul(this.model, this.model, mat);
        // mat4.getTranslation(this._position, this.model);
        // mat4.getScaling(this._scale, this.model);
        // mat4.getRotation(this._rotation, this.model);
    }

    setScale(x, y, z) {
        this.model            = mat4.scale(this.model, this.model, [x, y, z]);
        this.needsModelUpdate = true;
    }

    translate(x, y, z) {
        this.model = mat4.translate(this.model, this.model, [x, y, z]);
    }

    rotateX(rad) {
        this.model            = mat4.rotate(this.model, this.model, rad, _xA);
        this.needsModelUpdate = true;
    }

    rotateY(rad) {
        this.model            = mat4.rotate(this.model, this.model, rad, _yA);
        this.needsModelUpdate = true;

    }

    rotateZ(rad) {
        this.model            = mat4.rotate(this.model, this.model, rad, _zA);
        this.needsModelUpdate = true;
    }

    rotate(rad, axis) {
        this.model            = mat4.rotate(this.model, this.model, rad, axis);
        this.needsModelUpdate = true;
    }

    rotateXYZ(x, y, z) {
        this.model            = mat4.rotate(this.model, this.model, x, _xA);
        this.model            = mat4.rotate(this.model, this.model, y, _yA);
        this.model            = mat4.rotate(this.model, this.model, z, _zA);
        this.needsModelUpdate = true;
    }

    fromRotationTranslationScale(rotation, translation, scale) {
        this.model = mat4.fromRotationTranslationScale(this.model, rotation, translation, scale);
    }

    set position(pos) {
        // this._position        = vec3;
        mat4.getTranslation(_v3, this.model);
        vec3.sub(_v3, pos, _v3);
        this.model            = mat4.translate(this.model, this.model, _v3);
        this.needsModelUpdate = true;
    }

    get position() {
        mat4.getTranslation(_v3, this.model);
        return _v3;
    }

    set rotation(rot) {
        mat4.fromQuat(_m4, rot);
        this.model            = mat4.mul(this.model, this.model, _m4);
        this.needsModelUpdate = true;
    }

    get rotation() {
        mat4.getRotation(_q, this.model);
        return _q;
    }

    set scale(scale) {
        this.model            = mat4.scale(this.model, this.model, scale);
        this.needsModelUpdate = true;
    }

    get scale() {
        mat4.getScaling(_v3, this.model);
        return _v3;
    }

    //DEALING WITH UNIFORMS
    setUniform(name, data) {
        this.uniforms[name] = data;
    }

    bindModelNormal(model = "uModelMatrix", normal = "uNormalMatrix") {
        this.bindings.model  = model;
        this.bindings.normal = normal;
    }

    updateModelNormal() {
        this.setUniform(this.bindings.model, this._model);
        this._normal = mat4.transpose(mat4.create(), mat4.invert(mat4.create(), this.model));
        this.setUniform(this.bindings.normal, this._normal);

    }

}

core.prototype.isCore = true;

export {core};