import * as Vec3 from "../../lib/twgl/v3.js";
import * as Mat4 from "../../lib/twgl/m4.js";

const BOUNCE = 0.2
const COLLISION_OFFSET = 0.0001;

export default class Pool {
    
    /**
     * centered at middle point
     * @param {Number} pos 
     * @param {Number} width 
     * @param {Number} height 
     * @param {Number} depth 
     */
    constructor(pos, width, height, depth){
        this.width = width
        this.height = height
        this.depth = depth
        this.pos = pos
    }
    
    /**
     * simple collision detecion and response for particles moved from the inside to the outside of the cube
     * - the colliding component (x, y and/or z) of the particle is projected on the the wall again
     * - the velocity component of the colliding position component is flipped
     * TODO imporove bc  not very accurat
     * @param {Drop} drop 
     */
    collide(drop){
        let x = this.pos[0]
        let y = this.pos[1]
        let z = this.pos[2]

        /*const top = y+this.height/2
        if(drop.pos[1] >= top){
            drop.pos[1] = top-COLLISION_OFFSET) + (drop.pos[1]-top)/2
            drop.v[1] *= -BOUNCE
        }*/

        const bottom = y-this.height/2
        if(drop.pos[1] <= bottom){
            drop.pos[1] = bottom+COLLISION_OFFSET + (drop.pos[1]-bottom)/2
            drop.v[1] *= -BOUNCE
        }

        const left = x-this.width/2;
        if(drop.pos[0] <= left){
            drop.pos[0] = left+COLLISION_OFFSET + (drop.pos[0]-left)/2
            drop.v[0] *= -BOUNCE
        }

        const right = x+this.width/2;
        if(drop.pos[0] >= right){
            drop.pos[0] = right-COLLISION_OFFSET + (drop.pos[0]-right)/2
            drop.v[0] *= -BOUNCE
        }

        const back = z-this.depth/2;
        if(drop.pos[2] <= back){
            drop.pos[2] = back+COLLISION_OFFSET + (drop.pos[2]-back)/2
            drop.v[2] *= -BOUNCE
        }

        const front = z+this.depth/2;
        if(drop.pos[2] >= front){
            drop.pos[2] = front-COLLISION_OFFSET + (drop.pos[2]-front)/2
            drop.v[2] *= -BOUNCE
        }
    }
}
