import * as Vec3 from "../../lib/twgl/v3.js";
import * as Mat4 from "../../lib/twgl/m4.js";
import Drop from "./Drop.js";
import { intersectSegmentPlane, reflectVecOnPlane, EPSILON, testPointInBox } from "../tools/collision.js"


export default class Plane {

    color = [0, 1, 0, 1]

    constructor(pos, width, length){
        this.pos = pos
        this.width = width
        this.length = length
        this.n = Vec3.create(0, 1, 0)
    }

    /**
     * Collision mit andere normale klappt
     * TODO die Ebene auch schräg zeichnen können
     * 
     * @param {Drop} drop 
     */
    collide(drop){
        if(!(testPointInBox(drop.pos) || testPointInBox(drop.oldpos)))
            return
            
        let d = Vec3.dot(this.pos, this.n) // höhe in richtung n, siehe hess noralformel
        let hit = intersectSegmentPlane(drop.oldpos, drop.pos, this.n, d)
        
        if(!hit) 
            return

        let temp = Vec3.mulScalar(this.n, EPSILON)
        Vec3.add(hit, temp, hit)
        Vec3.copy(hit, drop.pos)
            
        reflectVecOnPlane(drop.v, this.n, temp)
        Vec3.mulScalar(temp, 0.9, drop.v)
    }
}