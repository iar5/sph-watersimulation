import * as Vec3 from "./../../../../lib/twgl/v3.js";
import * as Mat4 from "./../../../../lib/twgl/m4.js";import Vec3Factory from './Vec3Factory.js'
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
    constructor(spawn, drops, amount=100, offset=0.3, spread=0.01){
        this.spawn = spawn
        this.drops = drops
        this.amount = amount
        this.offset = offset
        this.spread = spread
    }

    update(dt){
        let spawns = Math.round(this.amount*dt) | 1

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
}