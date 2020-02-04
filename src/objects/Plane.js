import * as Vec3 from "../../lib/twgl/v3.js";
import * as Mat4 from "../../lib/twgl/m4.js";
import Drop from "./Drop.js";

export default class Plane {

    constructor(pos, width, height, depth){
        this.pos = pos
        this.width = width
        this.height = height
        this.depth = depth
    }

    collide(drop){

    }
}