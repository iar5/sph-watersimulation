import * as Vec3 from "../../lib/twgl/v3.js";
import * as Mat4 from "../../lib/twgl/m4.js";
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
        let go = new RandomeGenerator(-this.offset, this.offset)
        let gv = new RandomeGenerator(-this.spread, this.spread)

        for(let i = 0; i < spawns; i++){
            let s = Vec3Factory.create(go.r(), go.r(), go.r()) 
            let v = Vec3Factory.create(gv.r(), gv.r(), gv.r())
    
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
     * @param {Number} distance abstand zwischen zwei drops
     * @returns {Array} drops
     */
    static createDropCube(pos, amountX, amountY, amountZ, distance){
        let result = []
        let g = new RandomeGenerator(-distance*0.1, distance*0.1)
        
        for(let x=-amountX/2; x < amountX/2; x++){
            for(let y=-amountY/2; y < amountY/2; y++){
                for(let z=-amountZ/2; z < amountZ/2; z++){
                    let d = Vec3.create(
                        x*distance + distance/2,
                        y*distance + distance/2,
                        z*distance + distance/2
                    )
                    if(amountX > 1) d[0] += g.r()
                    if(amountY > 1) d[1] += g.r()
                    if(amountZ > 1) d[2] += g.r()

                    Vec3.add(d, pos, d)
                    result.push(new Drop(d))
                }
            }
        }
        return result
    }
}

function RandomeGenerator(start, end){
    return { 
        r(){ return start + Math.random() * end-start }
    }
}