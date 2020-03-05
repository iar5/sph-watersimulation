import * as Vec3 from "../../lib/twgl/v3.js";
import * as Mat4 from "../../lib/twgl/m4.js";
import Object3D from "./Object3D.js";
import Drop from "./Drop.js";
import { EPSILON, intersectSegmentPlane, reflectRayOnPlane, testPointRectangle, testSegmentPlane } from "../tools/collision.js"

const temp = Vec3.create()
const temp2 = Vec3.create()


export default class Rectangle extends Object3D {

    color = [.1, .8, .6, 1]
    n = Vec3.create(0, 1, 0)

    /**
     * TODO rotation given by n in modelmat 
     * @param {Number} width 
     * @param {Number} length 
     */
    constructor(pos, width, length){
        super()
        this._width = width
        this._length = length
        this._pos = pos
        Mat4.translate(this.modelMat, pos, this.modelMat)
        Mat4.scale(this.modelMat, [width, 1, length], this.modelMat)
    }

    /**
     * 
     * @param {Drop} drop 
     */
    collide(drop){   
        let d = Vec3.dot(this._pos, this.n) // distance from origin to plane 

        let hit = intersectSegmentPlane(drop.oldpos, drop.pos, this.n, d, temp) 
        if(!hit) return

        // TODO ray bzw ebene über matrix auf xy projezieren damit aabb ray kollision möglich
        // bigger plane because pool collision is simple/inaccurate and particles may cross
        if(!testPointRectangle(hit, this._pos , this._width+0.02, this._length+0.02)) 
            return

        Vec3.mulScalar(this.n, EPSILON, temp2)
        Vec3.add(hit, temp2, hit)
        Vec3.copy(hit, drop.pos)
            
        reflectRayOnPlane(drop.v, this.n, temp2)
        Vec3.mulScalar(temp2, 0.9, drop.v)
    }
}