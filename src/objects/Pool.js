import * as Vec3 from "/lib/twgl/v3.js";
import * as Mat4 from "/lib/twgl/m4.js";

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

    update(time){
        
    }

    collide(drop){
        let x = this.pos[0]
        let y = this.pos[1]
        let z = this.pos[2]

        // BOTTOM
        if(drop.pos[1] < y && drop.oldpos[1] > y 
            && Math.abs(drop.pos[0]) < x+this.width/2 
            && Math.abs(drop.pos[2]) < z+this.length/2
        ){
            drop.pos[1] = y+COLLISION_OFFSET
            drop.oldpos[1] = y+COLLISION_OFFSET
        }

        // LEFT
        const left = x-this.width/2;
        if(
            (drop.pos[0] < left && drop.oldpos[0] > left) ||
            (drop.pos[0] > left && drop.oldpos[0] < left) 
            //&& Math.abs(drop.pos[1]) < y+this.height/2 
            //&& Math.abs(drop.pos[2]) < z+this.length/2
        ){
            drop.pos[0] = left+COLLISION_OFFSET
            drop.oldpos[0] = left+COLLISION_OFFSET
        }

        // BACK
        const back = z+this.length/2;
        if(
            (drop.pos[2] < back && drop.oldpos[2] > back) ||
            (drop.pos[2] > back && drop.oldpos[2] < back) 
            //&& Math.abs(drop.pos[1]) < y+this.height/2 
            //&& Math.abs(drop.pos[2]) < z+this.length/2
        ){
            drop.pos[2] = back+COLLISION_OFFSET
            drop.oldpos[2] = back+COLLISION_OFFSET
        }  
    }
}
