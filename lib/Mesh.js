import {core} from "./Core.js";
import {mat4} from "../matrix/gl-matrix.js";

class Mesh extends core{
    constructor(geom, shader) {
        super();

        if(shader){
            shader.addChild(this);
        }

        this.geom = geom;

        this.bb = undefined;

        this.setUniform("uModelMatrix", this.model);

        this.setUniform("uNormalMatrix", mat4.transpose(mat4.create(), mat4.invert(mat4.create(), this.model) ) );

        // this.setModelNormalBind("uModelMatrix", "uNormalMatrix");
    }

    calcBB(){

    }
}

Mesh.prototype.isMesh = true;

export {Mesh}