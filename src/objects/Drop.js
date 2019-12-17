import * as Vec3 from "../../lib/twgl/v3.js";
import * as Mat4 from "../../lib/twgl/m4.js";
import Vec3Factory from "./Vec3Factory.js";

export class Drop {

    f = Vec3.create()
    pi
    rho

    /**
     * @param {Vec3} p position
     * @param {Vec3} v velocity pro sekunde
     */
    constructor(p=Vec3.create(), v=Vec3.create()){
        this.pos = p
        this.v = v
    }
}

