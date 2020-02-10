import * as Vec3 from "../../lib/twgl/v3.js";
import * as Mat4 from "../../lib/twgl/m4.js";
import Object3D from "./Object3D.js";
import Drop from "./Drop.js";
import { EPSILON, intersectSegmentPlane, reflectVecOnPlane, testPointRectangle, testSegmentPlane } from "../tools/collision.js"


const tempHit = Vec3.create()
const tempPos = Vec3.create()
const temp = Vec3.create()


export default class Rectangle extends Object3D {

    color = [.1, .8, .6, 1]
    n = Vec3.create(0, 1, 0)

    /**
     * 
     * @param {Number} width 
     * @param {Number} length 
     */
    constructor(pos, width, length){
        super()
        this.translate(pos)
        this.scale(Vec3.create(width, 1, length))
        this.width = width
        this.length = length
    }

    /**
     * Problem in der Ecke mit Wand wegen ungenauer Kollisionsbehandlung der Wand, deswegen Rectangle bisschen größer faken
     * testPointRectangle korrekt wenn ray projeziert wird 
     * testSegmentPlane nur korrekt für Rechteck was in XZ Ebene liegt, siehe TODO oben
     * 
     * TODO
     * n ersetzen durch rotation 
     * um n für berechnungen zu bekommen einfach die eckpunkte transformaieren mit matrix 
     * wenn ebene schräg ist kann mit matrix ray auf xz ebene projeziert werden und aabb ray kollision wieder möglich
     * @param {Drop} drop 
     */
    collide(drop){   
        let pos = this.getTranslation(tempPos)
        let d = Vec3.dot(pos, this.n) // abstand vom ursprung in richtung n, siehe hess noralformel

        if(!testSegmentPlane(drop.oldpos, drop.pos, d)) // nur für XZ 
            return
        
        let hit = intersectSegmentPlane(drop.oldpos, drop.pos, this.n, d, tempHit) // return value can be null 
        if(!hit)
            return

        if(!testPointRectangle(hit, pos, this.width+0.02, this.length+0.02)) 
            return

        Vec3.mulScalar(this.n, EPSILON, temp)
        Vec3.add(hit, temp, hit)
        Vec3.copy(hit, drop.pos)
            
        reflectVecOnPlane(drop.v, this.n, temp)
        Vec3.mulScalar(temp, 0.9, drop.v)
    }
}