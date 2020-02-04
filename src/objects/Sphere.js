import * as Vec3 from "../../lib/twgl/v3.js";
import * as Mat4 from "../../lib/twgl/m4.js";
import Drop from "./Drop.js";
import { isKeyHold } from "../tools/keyhold.js"
import { intersectRaySphere, reflectVecOnPlane, EPSILON } from "../tools/collision.js"

const ANIM_SPEED = 0.01
const ANIM_RANGE = 0.5

const vn = Vec3.create() // dir normalized
const hit = Vec3.create() // hit
const n = Vec3.create() // normal
const out = Vec3.create() // reflection vector, out dir


export default class Sphere {

    constructor(pos, radius){
        this.pos = pos
        this.r = radius
        this.color = [1, 0, 0, 1]
        this._animcount = 0
    }

    update(){
        this._animcount += ANIM_SPEED
        this.pos[0] = Math.sin(this._animcount) * ANIM_RANGE

        /*const A = 0.01
        if(isKeyHold(65)) this.pos[0] -= A
        if(isKeyHold(68)) this.pos[0] += A
        if(isKeyHold(87)) this.pos[1] += A
        if(isKeyHold(83)) this.pos[1] -= A*/
    }


    /**
     * Korrekte Kollisionsbehandlung für wenn Parttikel sich in Sphere beewgt hat
     * Geschwindigkeitsvektor wird gespiegelt an Oberfläche 
     * Partikel wird auf Hit gesetzt
     * 
     * TODO Kontinuierliche Kollision, Sphere bewegt sich und schiebt Partikel in Normalenrichtung weg
     * TODO mit Kraft und Impuls arbeiten?
     * @param {Drop} drop 
     */
    collide(drop){
        let dist = Vec3.distance(drop.pos, this.pos)
        if(dist > this.r) return

        Vec3.reset(vn)
        Vec3.reset(hit)
        Vec3.reset(n)
        Vec3.reset(out)

        let vl = Vec3.length(drop.v)
        Vec3.mulScalar(drop.v, 1/vl, vn)

        intersectRaySphere(drop.pos, vn, this.pos, this.r+EPSILON, hit)  

        Vec3.subtract(hit, this.pos, n)
        Vec3.normalize(n, n)
        reflectVecOnPlane(drop.v, n, out)

        Vec3.copy(hit, drop.pos)
        Vec3.copy(out, drop.v)
    }
}