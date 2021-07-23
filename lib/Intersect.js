import {vec3} from "../matrix/gl-matrix.js";

class Ray {
    constructor(origin, direction) {
        this.sign            = [];
        let inverseDirection = vec3.inverse(vec3.create(), direction);

        this.sign[0] = (inverseDirection[0] < 0);
        this.sign[1] = (inverseDirection[1] < 0);
        this.sign[2] = (inverseDirection[2] < 0);

        this.invdir = inverseDirection;

        this.orig = origin;
        this.dir  = direction;
    }
}

class AABB{

    /**
     * @param {vec3} min
     * @param {vec3} max
     */
    constructor(min, max) {
        this.bounds = [min, max];
    }

    /**
     * @param {Ray} ray
     * @param {number} t
     * @return {boolean}
     */
    intersect(ray, t){
        const bounds = this.bounds;

        let tmin, tmax, tymin, tymax, tzmin, tzmax;
        //remember [0] is x, [1] is y, [2] is z
        // console.log(ray);
        // console.log((bounds[ray.sign[0]*1][0] - ray.orig[0]) * ray.invdir[0]);

        // vec3.scale(vec3.create(), vec3.sub(vec3.create(), ))

        tmin = (bounds[ray.sign[0]*1][0] - ray.orig[0]) * ray.invdir[0];
        tmax = (bounds[1-ray.sign[0]*1][0] - ray.orig[0]) * ray.invdir[0];
        tymin = (bounds[ray.sign[1]*1][1] - ray.orig[1]) * ray.invdir[1];
        tymax = (bounds[1-ray.sign[1]*1][1] - ray.orig[1]) * ray.invdir[1];

        if ((tmin > tymax) || (tymin > tmax))
            return false;

        if (tymin > tmin)
            tmin = tymin;
        if (tymax < tmax)
            tmax = tymax;

        tzmin = (bounds[ray.sign[2]*1][2] - ray.orig[2]) * ray.invdir[2];
        tzmax = (bounds[1-ray.sign[2]*1][2] - ray.orig[2]) * ray.invdir[2];

        if ((tmin > tzmax) || (tzmin > tmax))
            return false;

        if (tzmin > tmin)
            tmin = tzmin;
        if (tzmax < tmax)
            tmax = tzmax;

        t = tmin;

        if (t < 0) {
            t = tmax;
            if (t < 0) return false;
        }

        return t;
    }

    getPositions(){
        const min = this.bounds[0];
        const max = this.bounds[1];
        let bb = [];

        bb.push(
            //vertices of most basic box possible
            //binary, thanks to threejs team
            min[0], min[1], min[2], //000

            min[0], min[1], max[2], //001

            min[0], max[1], min[2], //010

            min[0], max[1], max[2], //...

            max[0], min[1], min[2],

            max[0], min[1], max[2],

            max[0], max[1], min[2],

            max[0], max[1], max[2], //111
        );

        return bb;

    }

}

export {Ray, AABB}