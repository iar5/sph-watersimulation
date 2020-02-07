/**
 * @author Tom Wendland
 * 
 * TODO
 * standard plane is 1x1 und liegt an 0,0,0
 * verschiebung und skalierung etc über tansformationsmatrix
 * um n zu bekommen einfach die eckpunkte transformaieren mit matrix 
 * pos etc für berechnungen aus matrix generiegbar
 * 
 * für sphere keine matrix weil die nicht aus ner geometrie besteht sondern explizit definiert wird?!
 * 
 * Ziel durch tansformationsmatrix
 * - zeichnen der Ebene schräg sollte einfach sein
 * - wenn ebene schräg ist kann mit matrix ray auf xz ebene projeziert werden und aabb ray kollision wieder möglich
 */

import * as Vec3 from "../../lib/twgl/v3.js";
import * as Mat4 from "../../lib/twgl/m4.js";
import Drop from "./Drop.js";
import { EPSILON, intersectSegmentPlane, reflectVecOnPlane, testPointRectangle, testSegmentPlane } from "../tools/collision.js"

const hit = Vec3.create()
const temp = Vec3.create()

export default class Rectangle {

    color = [0, 1, 0, 1]

    constructor(pos, width, length){
        this.pos = pos
        this.width = width
        this.length = length
        this.n = Vec3.create(0, 1, 0)
    }

    /**
     * Problem in der Ecke mit Wand wegen ungenauer Kollisionsbehandlung der Wand, deswegen Rectangle bisschen größer faken
     * testPointRectangle und testSegmentPlane nur korrekt für Rechteck was in XZ Ebene liegt, siehe TODO oben
     * @param {Drop} drop 
     */
    collide(drop){   
        let d = Vec3.dot(this.pos, this.n) // höhe in richtung n, siehe hess noralformel

        if(!testSegmentPlane(drop.oldpos, drop.pos, d)) // nur für XZ 
            return
        
        let hitn = intersectSegmentPlane(drop.oldpos, drop.pos, this.n, d, hit) // return value can be null 
        
        if(!hitn || !testPointRectangle(hit, this.pos, this.width+0.02, this.length+0.02)) 
            return

        Vec3.mulScalar(this.n, EPSILON, temp)
        Vec3.add(hit, temp, hit)
        Vec3.copy(hit, drop.pos)
            
        reflectVecOnPlane(drop.v, this.n, temp)
        Vec3.mulScalar(temp, 0.9, drop.v)
    }
}