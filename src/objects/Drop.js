import * as Vec3 from "../../lib/twgl/v3.js";
import * as Mat4 from "../../lib/twgl/m4.js";

export default class Drop {

    // following values do not belong to the particle directly, but to the measuring point at particle position
    f = Vec3.create()
    pi = 0
    rho = 0

    /**
     * @param {Vec3} p position
     * @param {Vec3} v velocity in unit per second
     */
    constructor(p=Vec3.create(), v=Vec3.create()){
        this.pos = p
        this.v = v
    }
}

