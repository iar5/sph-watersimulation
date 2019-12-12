import * as Vec3 from "./../../../lib/twgl/v3.js";
import * as Mat4 from "./../../../lib/twgl/m4.js";
import Vec3Factory from "./Vec3Factory.js";
import { EXTERNAL_FORCES } from "../simulation.js";


export class Drop {

    oldpos = Vec3.create() // previous position for collision handling, dont change it beside in Drop.update()!
    m = 0.01 // mass 

    /**
     * @param {Vec3} p position
     * @param {Vec3} v velocity pro sekunde
     */
    constructor(p=Vec3.create(), v=Vec3.create()){
        this.pos = p
        this.v = v
        Vec3.copy(this.pos, this.oldpos)
    }
 
    /**
     * @param {Number} dt timestep
     */
    update(dt){
        Vec3.copy(this.pos, this.oldpos)

        let a = Vec3.mulScalar(EXTERNAL_FORCES, 0.0001) 
        
        Vec3.add(this.v, a, this.v)
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

