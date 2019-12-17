import * as Vec3 from "../../lib/twgl/v3.js";
import * as Mat4 from "../../lib/twgl/m4.js";
import { Drop } from "./Drop.js";
import Vec3Factory from "./Vec3Factory.js";
import { TIMESTEP } from "../simulation.js"


export const COLLISION_OFFSET = 0.001;
export const BOUNCE = 0.3;

export class Sphere {

    animcount = 0

    constructor(pos, radius){
        this.pos = pos
        this.r = radius
    }

    update(){
        this.animcount += TIMESTEP
        let x = Math.sin(this.animcount)
        this.pos[0] = x
    }

    /**
     * 
     * @param {Drop} drop 
     */
    collide(drop){
        var diff = Vec3.subtract(drop.pos, this.pos)
        var l = Vec3.length(diff)

        if(l < this.r){
            //Vec3.set(drop.pos
        }
    }

    /**
     * Gespiegelte Kollision über oldpos des partikels
     * Bisher nur Partikel bewegt sich in Sphere Kollision
     * TODO Sphere bewegt sich in Partikel Kollision
     * @param {Drop} drop 
     */
    collideCorrect(drop){
        const dist = Vec3.length(Vec3.subtract(drop.pos, this.pos) )

        if(dist > this.r) 
            return

        const dir = Vec3.subtract(drop.pos, drop.oldpos)
        Vec3.normalize(dir, dir)

        const hit = Sphere.intersectRaySphere(drop.pos, dir, this.pos, this.r+COLLISION_OFFSET)
        
        if(!hit)  
            return  
               
        const n = Vec3.subtract(hit, this.pos)
        Vec3.normalize(n, n)

        const reflect = Vec3.mulScalar(n, 2*Vec3.dot(dir, n))
        Vec3.subtract(dir, reflect, reflect)
        
        const out = Vec3.add(dir, reflect)
        Vec3.normalize(out, out) // physikalisch nicht begründet aber sieht richtig aus
        
        const speed = Vec3.length(drop.v)
        Vec3.mulScalar(out, speed*BOUNCE, out)

        Vec3.copy(hit, drop.pos)
        Vec3.copy(out, drop.v)

        Vec3Factory.add(dir, hit, n, reflect, out)
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
        var m = Vec3.subtract(p, s)
        var b = Vec3.dot(m, d);
        var c = Vec3.dot(m, m) - r*r;

        // Exit if r’s origin outside s (c > 0) and r pointing away from s (b > 0)
        if (c > 0 && b > 0) 
            return 

        var discr = b*b - c;

        // A negative discriminant corresponds to ray missing sphere
        if (discr < 0) 
            return 

        // Ray now found to intersect sphere, compute smallest t value of intersection 
        var t = -b - Math.sqrt(discr);

        var out = Vec3.mulScalar(d, t)
        Vec3.add(p, out, out)
        return out    
    }
}
