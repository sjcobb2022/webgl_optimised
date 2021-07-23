import {core} from "./Core.js";
import {mat4} from "../matrix/gl-matrix.js";

class Mesh extends core{
    constructor(geom, shader) {
        super();

        if(!shader || !shader.isShader){
            throw `${shader} must be instance of shader`
        }

        this.geom = geom;

        this.bb = undefined;

        this.bindModelNormal("uModelMatrix", "uNormalMatrix");
        this.updateModelNormal();

        shader.addChild(this);

        // this.setUniform("uModelMatrix", this.model);

        // this.setUniform("uNormalMatrix", mat4.transpose(mat4.create(), mat4.invert(mat4.create(), this.model) ) );

        // this.setModelNormalBind("uModelMatrix", "uNormalMatrix");
    }

    genBB(){
        this.geom.genBB(this.model);
    }


}

Mesh.prototype.isMesh = true;

export {Mesh}