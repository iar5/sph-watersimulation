import * as Vec3 from "../../lib/twgl/v3.js"
import * as Mat4 from "../../lib/twgl/m4.js"
import Object3D from "./Object3D.js"
import Drop from "./Drop.js"
import { EPSILON, intersectRaySphere, reflectRayOnPlane, testPointSphere } from "../tools/collision.js"


const ANIM_SPEED = 0.01
const ANIM_RANGE = 0.5

const vn = Vec3.create() // dir normalized
const hit = Vec3.create() // hit
const n = Vec3.create() // normal
const out = Vec3.create() // reflection vector, out dir


export default class Sphere extends Object3D{

    color = [.1, .8, .5, 1]

    // private members only for calculations
    _animcount = 0
    _r
    _pos = Vec3.create() 

    constructor(pos, radius){
        super()
        this._r = radius
        this._pos = Vec3.copy(pos, this._pos)
        Mat4.translate(this.modelMat, this._pos, this.modelMat)
        Mat4.scale(this.modelMat, [this._r, this._r, this._r], this.modelMat)
    }

    update(){
        this._pos[0] -= Math.sin(this._animcount) * ANIM_RANGE // zurück setzen damit pos erhalten bleibt
        this._animcount += ANIM_SPEED
        this._pos[0] += Math.sin(this._animcount) * ANIM_RANGE
        Mat4.setTranslation(this.modelMat, this._pos, this.modelMat)
    }
    
    /**
     * Korrekte Kollisionsbehandlung für wenn Parttikel sich in Sphere beewgt hat
     * Geschwindigkeitsvektor wird gespiegelt an Oberfläche 
     * Partikel wird auf Hit gesetzt
     * 
     * TODO Kontinuierliche Kollision, Sphere bewegt sich und schiebt Partikel in Normalenrichtung weg
     * TODO mit Kraft und Impuls arbeiten?
     * TODO use oldpos instead of v for ray
     * TODO wenn partikel in sphere spawnt absturz
     * @param {Drop} drop 
     */
    collide(drop){
        if(!testPointSphere(drop.pos, this._pos, this._r))
            return

        Vec3.reset(vn)
        Vec3.reset(hit)
        Vec3.reset(n)
        Vec3.reset(out)

        let vl = Vec3.length(drop.v)
        Vec3.mulScalar(drop.v, 1/vl, vn)

        intersectRaySphere(drop.pos, vn, this._pos, this._r+EPSILON, hit)  

        Vec3.subtract(hit, this._pos, n)
        Vec3.normalize(n, n)
        reflectRayOnPlane(drop.v, n, out)

        Vec3.copy(hit, drop.pos)
        Vec3.copy(out, drop.v)
    }
}