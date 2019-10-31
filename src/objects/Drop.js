import * as Vec3 from "./../../lib/twgl/v3.js";
import Vec3Factory from "./Vec3Factory.js";

export class Drop {

    /**
     * 
     * @param {Vec3} p position
     * @param {Vec3} v initial velocity used for oldposition
     * @var {Namber} oldtimestep used to determine an comparable implizit valocity from verlet integrstion
     */
    constructor(p=Vec3Factory.create(), v=Vec3Factory.create()){
        this.pos = p
        this.oldpos = Vec3.subtract(p, v, v)
        this.oldtimestep = 0;
    }

    /**
     *
     * @param {Vec3} t timestep
     * @param {Vec3} f external force
     */
    update(t, f){
        let temp = Vec3Factory.create()
        Vec3.copy(this.pos, temp)

        let a = Vec3Factory.create() // dont need to consider the time since we asume he is the same as in the last iteration
        Vec3.subtract(this.pos, this.oldpos, a)

        Vec3.add(this.pos, f, this.pos)
        Vec3.add(this.pos, a, this.pos)
        Vec3.copy(temp, this.oldpos)
        Vec3Factory.add(temp)
    }

    /**
     * Frees used Vectors to reuse them later 
     */
    free(){
        Vec3Factory.add(this.pos)
        Vec3Factory.add(this.oldpos)
    }
}

