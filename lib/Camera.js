import {mat4, vec3} from "../matrix/gl-matrix.js";
import {core}       from "./Core.js";

class Camera extends core{

    constructor(fov, aspectRatio, zNear, zFar) {
        super();

        this.projection = mat4.create();

        mat4.perspective(this.projection, fov, aspectRatio, zNear, zFar);


    }

    get view(){
        return this.model;
    }







}