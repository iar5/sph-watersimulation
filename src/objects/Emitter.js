import * as Vec3 from "../../lib/twgl/v3.js";
import * as Mat4 from "../../lib/twgl/m4.js";
import Drop from './Drop.js'


export default class Emitter{

    /**
     * 
     * @param {Vec3} pos position
     * @param {Array} drops data destination
     * @param {Number} amount particles per millisecond
     * @param {Vec3} velocity initial velocity 
     * @param {Number} offset pos offset from position
     * @param {Number} spread additional initial velocity in a randome direction
     */
    constructor(pos, drops, amount=1, velocity=Vec3.create(), offset=0.3, spread=0.01){
        this.pos = pos
        this.drops = drops
        this.amount = amount
        this.velocity = velocity
        this.offset = offset
        this.spread = spread
    }

    update(){
        let go = new RandomeGenerator(-this.offset, this.offset)
        let gv = new RandomeGenerator(-this.spread, this.spread)

        for(let i = 0; i < this.amount; i++){
            let s = Vec3.create(go.r(), go.r(), go.r()) 
            let v = Vec3.create(gv.r(), gv.r(), gv.r())
    
            Vec3.add(this.pos, s, s)
            Vec3.add(this.velocity, v, v)
            
            let d = new Drop(s, v)
            this.drops.push(d)
        }
    }

    /**
     * creates a cube of drops
     * 2d possible aswell
     * @param {Vec3} pos center point of the cube
     * @param {Number} amountX 
     * @param {Number} amountY 
     * @param {Number} amountZ 
     * @param {Number} distance between two drop center points (= diameter of a drop)
     * @returns {Array} created drops
     */
    static createDropCube(pos, amountX, amountY, amountZ, distance){
        let g = new RandomeGenerator(-distance*0.01, distance*0.01)
        let result = []
        
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

    /**
     * creates a cube of drops
     * @param {Vec3} pos approx center point of the cube
     * @param {Number} amountX 
     * @param {Number} amountY 
     * @param {Number} amountZ 
     * @param {Number} distance between two drop center points (= diameter of a drop)
     * @returns {Array} created drops
     */
    static createDropCubeByAmount(pos, amount, distance){
        let g = new RandomeGenerator(-distance*0.01, distance*0.01)
        let result = []

        let size = Math.floor(Math.cbrt(amount))
        var counter = 0
        
        for(let y=-size/2; counter < amount; y++){
            for(let x=-size/2; x < size/2 && counter < amount; x++){
                for(let z=-size/2; z < size/2 && counter < amount; z++){
                    let d = Vec3.create(
                        x*distance + distance/2 + g.r(),
                        y*distance + distance/2 + g.r(),
                        z*distance + distance/2 + g.r()
                    )
                    counter++
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
        r() { return start + Math.random() * end-start }
    }
}