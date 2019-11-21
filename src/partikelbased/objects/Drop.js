import * as Vec3 from "./../../../../lib/twgl/v3.js";
import * as Mat4 from "./../../../../lib/twgl/m4.js";
import Vec3Factory from "./Vec3Factory.js";

export class Drop {

    /**
     * 
     * @param {Vec3} p position
     * @param {Vec3} v velocity 
     * @var {Namber} oldtimestep used to determine an comparable implizit valocity from verlet integrstion
     */
    constructor(p=Vec3Factory.create(), v=Vec3Factory.create()){
        this.pos = p
        this.v = v
        this.oldtimestep = 0;
    }

    /**
     * @param {Number} time timestamp
     * @param {Number} tstep timestep
     * @param {Vec3} f external force
     */
    update(tstep, f){
        // TODO consider mass and timestep
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

