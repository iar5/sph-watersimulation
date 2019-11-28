import * as Vec3 from "./../../../lib/twgl/v3.js";
import * as Mat4 from "./../../../lib/twgl/m4.js";
import Vec3Factory from "./Vec3Factory.js";
import { EXTERNAL_FORCES } from "../simulation.js";


export class Drop {

    m = 0.01 // mass
    oldpos = Vec3.create() // previous position for collision handling, dont change it beside in Drop.update()!

    /**
     * @param {Vec3} p position
     * @param {Vec3} v velocity 
     */
    constructor(p=Vec3Factory.create(), v=Vec3Factory.create()){
        this.pos = p
        this.v = v
        Vec3.copy(this.pos, this.oldpos)
    }
 
    /**
     * @param {Number} dt timestep
     */
    update(dt){
        // TODO consider mass 
        let f = Vec3.mulScalar(EXTERNAL_FORCES, dt*this.m)

        Vec3.copy(this.pos, this.oldpos)
        Vec3.add(this.v, f, this.v)
        Vec3.add(this.pos, this.v, this.pos)
    }

    /**
     * Frees used Vectors to reuse them later 
     */
    free(){
        Vec3Factory.add(this.pos)
        Vec3Factory.add(this.v)
    }
}

