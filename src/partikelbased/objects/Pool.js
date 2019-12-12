import * as Vec3 from "./../../../lib/twgl/v3.js";
import * as Mat4 from "./../../../lib/twgl/m4.js";

const BOUNCE = 0.1
const FRICTION = 0.1
const COLLISION_OFFSET = 0.0001;

export class Pool {
    
    constructor(pos, width, length, height){
        this.width = width
        this.length = length
        this.heigth = height
        this.pos = pos
    }

    update(dt){
        
    }

    /**
     * einfache kollision von innen nach außen in nem 1x1x1 würfel
     * @param {Drop} drop 
     */
    collide(drop){
        let x = this.pos[0]
        let y = this.pos[1]
        let z = this.pos[2]

        if(drop.pos[1] <= y){
            drop.pos[1] = y+COLLISION_OFFSET
            drop.v[1] = -drop.v[1]*BOUNCE
        }

        const left = x-this.width/2;
        if(drop.pos[0] <= left){
            drop.pos[0] = left+COLLISION_OFFSET
            drop.v[0] = -drop.v[0]*BOUNCE
        }

        const right = x+this.width/2;
        if(drop.pos[0] >= right){
            drop.pos[0] = right-COLLISION_OFFSET
            drop.v[0] = -drop.v[0]*BOUNCE
        }

        const back = x-this.length/2;
        if(drop.pos[2] <= back){
            drop.pos[2] = back+COLLISION_OFFSET
            drop.v[2] = -drop.v[2]*BOUNCE
        }

        const front = x+this.length/2;
        if(drop.pos[2] >= front){
            drop.pos[2] = front-COLLISION_OFFSET
            drop.v[2] = -drop.v[2]*BOUNCE
        }
    }

    collide2(drop){
        /**
         * kollision mit beachten der maße des pools
         * oldpos zum testen ob innerhalb bewegung durch plane weil pos an ner kante außerhalb sein könnte wenn zb diagonal bewegt
         * klappt nur gut wenn kollision von innen nach außen gesucht wird
         */

        let x = this.pos[0]
        let y = this.pos[1]
        let z = this.pos[2]

        let oldpos = drop.oldpos

        // BOTTOM
        if(
            (drop.pos[1] <= y && oldpos[1] >= y) 
            && Math.abs(oldpos[0]) <= x+this.width/2 
            && Math.abs(oldpos[2]) <= z+this.length/2
        ){
            drop.pos[1] = y+COLLISION_OFFSET
            drop.v[1] = -drop.v[1]*BOUNCE
        }

        // LEFT
        const left = x-this.width/2;
        if(
            (drop.pos[0] <= left && oldpos[0] >= left) ||
            (drop.pos[0] >= left && oldpos[0] <= left) 
            && Math.abs(oldpos[1]) <= y+this.height/2 
            && Math.abs(oldpos[2]) <= z+this.length/2
        ){
            drop.pos[0] = left+COLLISION_OFFSET
            drop.v[0] = -drop.v[0]*BOUNCE
        }

         // BACK
         const back = z-this.length/2;
         if(
             (drop.pos[2] < back && oldpos[2] > back) ||
             (drop.pos[2] > back && oldpos[2] < back) 
             && Math.abs(oldpos[1]) < y+this.height/2 
             && Math.abs(oldpos[0]) < z+this.width/2
         ){
             drop.pos[2] = back+COLLISION_OFFSET
             drop.v[2] = -drop.v[2]*BOUNCE
         } 
    }
}
