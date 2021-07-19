import {core} from "./Core.js";
import {mat4} from "../matrix/gl-matrix.js";

class Mesh extends core{
    constructor(geom) {
        super();

        this.geom = geom;

        this.bb = undefined;

        this.addUniform("uModelMatrix", this.model);

        this.addUniform("uNormalMatrix", mat4.transpose(mat4.create(), mat4.invert(mat4.create(), this.model) ) );
    }

    updateModelMatrix(){
        super.updateModelMatrix();
        this.addUniform("uModelMatrix", this.model);
        this.addUniform("uNormalMatrix", mat4.transpose(mat4.create(), mat4.invert(mat4.create(), this.model) ) );
    }

    calcBB(){

    }
}

Mesh.prototype.isMesh = true;

export {Mesh}