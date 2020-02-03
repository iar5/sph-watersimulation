import * as Vec3 from "../../lib/twgl/v3.js";
import * as Mat4 from "../../lib/twgl/m4.js";
import Drop from "./Drop.js";
import { isKeyHold } from "../../lib/keyhold.js"

const COLLISION_OFFSET = 0.0001
const ANIM_SPEED = 0.01
const ANIM_RANGE = 0.5

const vn = Vec3.create() // dir normalized
const hit = Vec3.create() // hit
const n = Vec3.create() // normal
const out = Vec3.create() // reflection vector, out dir
const m = Vec3.create() // for hit calc


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
    }


    /**
     * Korrekte Kollisionsbehandlung
     * Geschwindigkeitsvektor wird gespiegelt an Oberfläche 
     * https://math.stackexchange.com/questions/13261/how-to-get-a-reflection-vector

     * Nur Partikel auf/in Sphere wird beachtet 
     * -> TODO
     * Kontinuierliche Kollision
     * Sphere bewegt sich und schiebt Partikel in Normalenrichtung weg
     * mit Kraft und Impuls arbeiten?
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

        Sphere.intersectRaySphere(drop.pos, vn, this.pos, this.r+COLLISION_OFFSET, hit)  

        Vec3.subtract(hit, this.pos, n)
        Vec3.normalize(n, n)

        // out = in - (in * n) 2n
        Vec3.mulScalar(n, 2*Vec3.dot(vn, n), out)
        Vec3.subtract(vn, out, out)
        Vec3.mulScalar(out, vl, out)

        Vec3.copy(hit, drop.pos)
        Vec3.copy(out, drop.v)
    }


    /**
     * by Christer Ercison book
     * Intersects ray r = p + td, |d| = 1 with sphere
     * @param {Vec3} p Origin
     * @param {Vec3} d normalized Direction
     * @param {Vec3} s Sphere position
     * @param {Number} r Sphere radius
     * @param {Vec} intersection point
     * @param {Vec3} dst vector
     */
    static intersectRaySphere(p, dn, s, r, dst=Vec3.create()){
        Vec3.subtract(p, s, m)
        let b = Vec3.dot(m, dn)
        let c = Vec3.dot(m, m) - r*r

        // Exit if r’s origin outside s (c > 0) and r pointing away from s (b > 0)
        if (c > 0 && b > 0) return 
        let discr = b*b - c;

        // A negative discriminant corresponds to ray missing sphere
        if (discr < 0) return 

        // Ray now found to intersect sphere, compute smallest t value of intersection 
        let t = -b - Math.sqrt(discr);

        Vec3.mulScalar(dn, t, dst)
        Vec3.add(p, dst, dst)
        return dst    
    }
}
