import {core} from "./Core.js";

class Scene extends core {

    constructor(background = {r: 0.0, g: 0.0, b: 0.0, a: 1.0}) {
        super();

        this.background = background;
    }

    setBackgroundRGB(r=1.0,g=1.0,b=1.0,a=1.0){
        const tempR = Math.abs(r);
        const tempG = Math.abs(g);
        const tempB = Math.abs(b);
        const tempA = Math.abs(a);

        //red final, green final, blue final
        const rf = tempR > 1 ? Math.min(255, tempR) / 255 : tempR;
        const gf = tempG > 1 ? Math.min(255, tempG) / 255 : tempG;
        const bf = tempB > 1 ? Math.min(255, tempB) / 255 : tempB;
        const af = tempA > 1 ? Math.min(255, tempA) / 255 : tempA;

        this.background.r = rf;
        this.background.g = gf;
        this.background.b = bf;
        this.background.a = af;
    }

    setBackgroundHex(hex, alpha = 1.0){
        this.background.r = (hex >> 16 & 255) / 255;
        this.background.g = (hex >> 8 & 255) / 255;
        this.background.b = (hex & 255) / 255;
        this.background.a = alpha;
    }

}

Scene.prototype.isScene = true;

export {Scene}