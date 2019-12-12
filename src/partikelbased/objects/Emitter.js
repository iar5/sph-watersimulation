import * as Vec3 from "./../../../lib/twgl/v3.js";
import * as Mat4 from "./../../../lib/twgl/m4.js";
import Vec3Factory from './Vec3Factory.js'
import { Drop } from './Drop.js'


export class Emitter{

    /**
     * 
     * @param {Vec3} spawn position
     * @param {Array} drops data destination
     * @param {Number} amount particles per second
     * @param {Number} offset spawn offset from position
     * @param {Number} spread initial velocity in a randome direction
     */
    constructor(spawn, drops, amount=1, offset=0.3, spread=0.01){
        this.spawn = spawn
        this.drops = drops
        this.amount = amount
        this.offset = offset
        this.spread = spread
    }

    update(){
        let spawns = Math.round(this.amount) | 1

        for(let i = 0; i < spawns; i++){
            let s = Vec3Factory.create(
                (Math.random()-0.5) * this.offset, 
                (Math.random()-0.5) * this.offset, 
                (Math.random()-0.5) * this.offset, 
            )
            let v = Vec3Factory.create(
                (Math.random()-0.5) * this.spread, 
                (Math.random()-0.5) * this.spread, 
                (Math.random()-0.5) * this.spread, 
            )

            Vec3.add(this.spawn, s, s)
            let d = new Drop(s, v)
            this.drops.push(d)
        }
    }

    /**
     * 
     * @param {Vec3} pos 
     * @param {Number} amountX 
     * @param {Number} amountY 
     * @param {Number} amountZ 
     * @param {Number} density 
     * @returns {Array} drops
     */
    static createDropCube(pos, amountX, amountY, amountZ, density){
        let result = []

        for(let x=-amountX/2; x < amountX/2; x++){
            for(let y=-amountY/2; y < amountY/2; y++){
                for(let z=-amountZ/2; z < amountZ/2; z++){
                    let d = Vec3.create(
                        x*density + density/2, 
                        y*density + density/2, 
                        z*density + density/2
                    )
                    Vec3.add(d, pos, d)
                    result.push(new Drop(d))
                }
            }
        }
        return result
    }
}