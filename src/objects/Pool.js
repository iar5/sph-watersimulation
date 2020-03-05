import * as Vec3 from "../../lib/twgl/v3.js";
import * as Mat4 from "../../lib/twgl/m4.js";
import { intersectSegmentPlane, reflectRayOnPlane, EPSILON, pointPlaneDistance } from "../tools/collision.js"

const BOUNCE = 0.2
const COLLISION_OFFSET = 0.0001;

const temp = Vec3.create()
const temp2 = Vec3.create()


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
     * @param {Drop} drop 
     */
    collide(drop){
        let x = this.pos[0]
        let y = this.pos[1]
        let z = this.pos[2]

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

    /**
     * Correct collision detection but due to calculation inaccuracies particles may leave the pool
     * @param {Drop} drop 
     */
    collide2(drop){
        const w = this.pos[0]-this.width/2
        const h = this.pos[1]-this.height/2
        const d = this.pos[2]-this.depth/2

        this._collideWall(drop, [1, 0, 0], w) 
        this._collideWall(drop, [-1, 0, 0], w) 
        this._collideWall(drop, [0, 1, 0], h) 
        this._collideWall(drop, [0, 0, 1], d) 
        this._collideWall(drop, [0, 0, -1], d) 
    }

    _collideWall(drop, n, d){
        let hit = intersectSegmentPlane(drop.oldpos, drop.pos, n, d, temp) 
        if(!hit) return

        Vec3.mulScalar(n, EPSILON, temp2)
        Vec3.add(hit, temp2, hit)
        Vec3.copy(hit, drop.pos)
            
        reflectRayOnPlane(drop.v, n, temp2)
        Vec3.mulScalar(temp2, 0.9, drop.v)
    }
}
