import * as Vec3 from "./../../../../lib/twgl/v3.js";
import * as Mat4 from "./../../../../lib/twgl/m4.js";
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
        var dd = Vec3.subtract(drop.pos, this.pos) 
        if(drop.pos[1] > this.pos[1] && Vec3.length(dd) < this.r){
            Vec3.normalize(dd, dd)
            Vec3.mulScalar(dd, this.r + COLLISION_OFFSET, dd)
            Vec3.add(this.pos, dd, dd)
            Vec3.copy(dd, drop.pos)
        }
    }
}
