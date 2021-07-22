import {mat4, quat, vec3} from "../matrix/gl-matrix.js";
import {core}             from "./Core.js";

class Camera extends core{

    constructor(fov, aspectRatio, zNear, zFar, projectionTag="uProjectionMatrix", normalTag="uNormalMatrix") {
        super();

        this.projection = mat4.create();

        mat4.perspective(this.projection, fov, aspectRatio, zNear, zFar);

        this.needsModelUpdate = true;

        // this.updateModelMatrix();

        this.up = null;
    }

    get view(){
        return this.model;
    }

    lookAt(lookAtPos){

        // this.updateModelMatrix();
        // mat4.translate(this.model, )
        // mat4.lookAt(this.model, this.position, lookAtPos, [ this.model[2], this.model[6], this.model[8] ] );
        // this.needsModelUpdate = true;
        // mat4.targetTo(this.model, )
        let test  = mat4.create();

        // const up = [0,1,0];

        // mat4.lookAt(test,  [0,0,0], this._position,[this.model[4], this.model[5], this.model[6] ] );

        // console.log(test);
        // console.log(mat4.getScaling(vec3.create(), test));
        //  console.log(mat4.getTranslation(vec3.create(), test), mat4.getTranslation(vec3.create(), this.model))

        // mat4.getRotation(this._rotation, test);

        this.needsModelUpdate = true;
        // console.log(test);
        // console.log(mat4.getRotation(quat.create(), test));
        // this._rotation = mat4.getRotation(quat.create(), test);
        // console.log(up);
        // console.log();
        // this._position = mat4.getTranslation(vec3.create(), test);
        // this._scale = mat4.getScaling(vec3.create(), test);

        // console.log("after: ", this.model);

        // console.log(this._position);
        // this.needsModelUpdate = true;
        // mat4.mul(this.model, this.model, test);

        // this.needsModelUpdate = true;
    }
}

export {Camera}