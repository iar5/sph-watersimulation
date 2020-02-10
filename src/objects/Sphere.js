import * as Vec3 from "../../lib/twgl/v3.js";
import * as Mat4 from "../../lib/twgl/m4.js";
import Drop from "./Drop.js";
import { isKeyHold } from "../tools/keyhold.js"
import { EPSILON, intersectRaySphere, reflectVecOnPlane, testPointSphere } from "../tools/collision.js"
import Object3D from "./Object3D.js";


const ANIM_SPEED = 0.01
const ANIM_RANGE = 0.5

const vn = Vec3.create() // dir normalized
const hit = Vec3.create() // hit
const n = Vec3.create() // normal
const out = Vec3.create() // reflection vector, out dir
const tempPos = Vec3.create()


export default class Sphere extends Object3D{

    color = [.1, .8, .5, 1]
    _animcount = 0
    _pos = Vec3.create() // nur damit bei update nicht jedes mal neue objekt erstellt werden muss

    constructor(pos, radius){
        super()
        this.r = radius
        this._pos = Vec3.copy(pos, this._pos)
        this.translate(pos)
        this.scale([this.r, this.r, this.r])
    }

    update(){
        this._animcount += ANIM_SPEED
        this._pos[0] = Math.sin(this._animcount) * ANIM_RANGE
        this.setTranslation(this._pos)
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
        let pos = this.getTranslation(tempPos)

        if(!testPointSphere(drop.pos, pos, this.r))
            return

        Vec3.reset(vn)
        Vec3.reset(hit)
        Vec3.reset(n)
        Vec3.reset(out)

        let vl = Vec3.length(drop.v)
        Vec3.mulScalar(drop.v, 1/vl, vn)

        intersectRaySphere(drop.pos, vn, pos, this.r+EPSILON, hit)  

        Vec3.subtract(hit, pos, n)
        Vec3.normalize(n, n)
        reflectVecOnPlane(drop.v, n, out)

        Vec3.copy(hit, drop.pos)
        Vec3.copy(out, drop.v)
    }
}