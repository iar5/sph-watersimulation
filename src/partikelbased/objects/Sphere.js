import * as Vec3 from "./../../../lib/twgl/v3.js";
import * as Mat4 from "./../../../lib/twgl/m4.js";
import { Drop } from "./Drop.js";


const COLLISION_OFFSET = 0.0001;

export class Sphere {

    constructor(pos, radius){
        this.pos = pos
        this.r = radius
    }

    update(tstep){
        let x = Math.sin(Date.now()/500)*0.6
        this.pos[0] = x
    }

    /**
     * 
     * @param {Drop} drop 
     */
    collide(drop){
        const dist = Vec3.subtract(drop.pos, this.pos) 
        const l = Vec3.length(dist)
        const d = l - this.r  // abstand = zur kugeloberfläche von außen betrachtet

        if(d <= 0){
            const oldpos = Vec3.subtract(drop.pos, drop.v)

            const posnew = Vec3.normalize(dist)
            Vec3.mulScalar(posnew, this.r+COLLISION_OFFSET, posnew)

            const vnew = Vec3.subtract(posnew, oldpos)
            Vec3.mulScalar(vnew, Vec3.length(drop.v)/2, vnew)

            Vec3.copy(posnew, drop.pos)
            Vec3.copy(vnew, drop.v)
        }
    }
}
