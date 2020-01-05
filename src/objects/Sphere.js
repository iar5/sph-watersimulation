import * as Vec3 from "../../lib/twgl/v3.js";
import * as Mat4 from "../../lib/twgl/m4.js";
import { Drop } from "./Drop.js";
import { isKeyHold } from "../../lib/keyhold.js"

const BOUNCE = 0.2
const COLLISION_OFFSET = 0.001
const ANIM_SPEED = 0.01
const ANIM_RANGE = 0.5

export class Sphere {

    constructor(pos, radius){
        this.pos = pos
        this.r = radius
        this.color = [1, 0, 0, 1]
        this._animcount = 0
    }

    update(){
        this._animcount += ANIM_SPEED
        this.pos[0] -= Math.sin(this._animcount-ANIM_SPEED) * ANIM_RANGE // zurück setzen
        this.pos[0] += Math.sin(this._animcount) * ANIM_RANGE
    }

    /**
     * Ansatz: Sphere bewegt sich schiebt Partikel weg, Kraft geht in Normalenrichtung 
     * @param {Drop} drop 
     */
    collide(drop){
        let diff = Vec3.subtract(drop.pos, this.pos)
        let l = Vec3.length(diff)
        
        if(l < this.r + COLLISION_OFFSET){

            Vec3.normalize(diff, diff)
            Vec3.mulScalar(diff, this.r, diff)
            Vec3.add(diff, this.pos, diff)
            Vec3.copy(diff, drop.pos)
            
            // add force instead of multiplying the reverse
            Vec3.mulScalar(drop.v, -BOUNCE, drop.v)
        }
    }

    /**
     * (Korrekte) Kollisionsbehandlung für wenn(!) Partikel auf/in Sphere fällt 
     * Gespiegelte Kollision über oldpos des Partikels
     * @param {Drop} drop 
     */
    collide2(drop){
        let dist = Vec3.length(Vec3.subtract(drop.pos, this.pos) )

        if(dist > this.r) return

        let dir = Vec3.subtract(drop.pos, drop.oldpos)
        Vec3.normalize(dir, dir)

        let hit = Sphere.intersectRaySphere(drop.pos, dir, this.pos, this.r+COLLISION_OFFSET)
        
        if(!hit) return  
               
        let n = Vec3.subtract(hit, this.pos)
        Vec3.normalize(n, n)

        let reflect = Vec3.mulScalar(n, 2*Vec3.dot(dir, n))
        Vec3.subtract(dir, reflect, reflect)
        
        let out = Vec3.add(dir, reflect)
        Vec3.normalize(out, out) // physikalisch nicht begründet aber sieht richtig aus
        
        let speed = Vec3.length(drop.v)
        Vec3.mulScalar(out, speed*BOUNCE, out)

        Vec3.copy(hit, drop.pos)
        Vec3.copy(out, drop.v)
    }


    /**
     * @author Christer Ercison
     * @description Intersects ray r = p + td, |d| = 1 with sphere
     * @param {Vec3} p Origin
     * @param {Vec3} d Direction
     * @param {Vec3} s Sphere position
     * @param {Number} r Sphere radius
     * @param {Vec} intersection point
     */
    static intersectRaySphere(p, d, s, r){
        let m = Vec3.subtract(p, s)
        let b = Vec3.dot(m, d);
        let c = Vec3.dot(m, m) - r*r;

        // Exit if r’s origin outside s (c > 0) and r pointing away from s (b > 0)
        if (c > 0 && b > 0) return 

        let discr = b*b - c;

        // A negative discriminant corresponds to ray missing sphere
        if (discr < 0) return 

        // Ray now found to intersect sphere, compute smallest t value of intersection 
        let t = -b - Math.sqrt(discr);

        let out = Vec3.mulScalar(d, t)
        Vec3.add(p, out, out)
        return out    
    }
}
