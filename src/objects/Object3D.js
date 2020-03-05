import * as Vec3 from "../../lib/twgl/v3.js";
import * as Mat4 from "../../lib/twgl/m4.js";

/**
 * Base class for 3D objects which holds the transformation matrix
 */
export default class Object3D {

    constructor(){
        this.modelMat = Mat4.identity()
    }
}


/**
 * Problem: Dopplung von Pos und ModelMatrix
 * Nur Pos allein zu handeln wäre ok, denn es gibt Mat4.getTranslation()
 * Für Rotation und Scale gibts das aber nicht
 * 
 * Problem: Accessor set pos() könnte Pos aktualsieren und ModelMatrix zugleich
 * Aber Pos wird über Vec3.set(val, vec) gesetzt und nicht als Zuweisung mit nem =
 * 
 * Daher doppelt speichern
 */