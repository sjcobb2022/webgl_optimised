import {mat4} from "../matrix/gl-matrix.js";
import {core}       from "./Core.js";

class Camera extends core{

    constructor(fov, aspectRatio, zNear, zFar) {
        super();

        this.projection = mat4.create();

        mat4.perspective(this.projection, fov, aspectRatio, zNear, zFar);

        this.needsModelUpdate = true;

    }

    get view(){
        return this.model;
    }

    lookAt(lookAtPos, up = [0, 1, 0]){

        mat4.lookAt(this.model, this.position, lookAtPos, up);

    }
}

export {Camera}