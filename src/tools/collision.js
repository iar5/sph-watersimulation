/**
 * @author Tom Wendland
*/

import * as Vec3 from "./../../lib/twgl/v3.js";
import * as Mat4 from "./../../lib/twgl/m4.js";


export const EPSILON = 0.0001

const temp = Vec3.create() // for hit calc

/**
 * From Christer Ercison's book
 * Intersects ray r = p + td, |d| = 1 with sphere
 * Weil kleinste (auch negative) t genommen wird ist garantiert dass es Eintrittspunkt ist
 * @param {Vec3} p Origin
 * @param {Vec3} d normalized Direction
 * @param {Vec3} s Sphere position
 * @param {Number} r Sphere radius
 * @param {Vec} intersection point
 * @param {Vec3?} dst vector
 * @returns {Vec3?} dst
 */
export function intersectRaySphere(p, dn, s, r, dst=Vec3.create()){
    let m = temp
    Vec3.subtract(p, s, m)
    let b = Vec3.dot(m, dn)
    let c = Vec3.dot(m, m) - r*r

    // Exit if r’s origin outside s (c > 0) and r pointing away from s (b > 0)
    if (c > 0 && b > 0) return null
    let discr = b*b - c;
    // A negative discriminant corresponds to ray missing sphere
    if (discr < 0) return null
    // Ray now found to intersect sphere, compute smallest t value of intersection 
    let t = -b - Math.sqrt(discr);

    Vec3.mulScalar(dn, t, dst)
    Vec3.add(p, dst, dst)
    return dst    
}

/**
 * From Christer Ercison's book
 * @param {Vec3} a point a
 * @param {Vec3} b point b
 * @param {Vec3} n plane normal
 * @param {Vec3} d position der ebene in Normalenrichtung, siege Hessische Normalform
 * @param {Vec3?} out 
 * @returns {Vec3?} out
 */
export function intersectSegmentPlane(a, b, n, d, out=Vec3.create()){
    // Compute the t value for the directed line ab intersecting the plane
    let ab = temp
    Vec3.subtract(b, a, temp)

    let t = (d - Vec3.dot(n, a)) / Vec3.dot(n, ab);

    // If t in [0..1] compute and return intersection point
    // q = a + t * ab;
    if (t >= 0 && t <= 1){ 
        Vec3.mulScalar(ab, t, ab)
        Vec3.add(a, ab, ab)
        Vec3.copy(ab, out)
        return out
    }
    else 
        return null
}

/**
 * https://math.stackexchange.com/questions/13261/how-to-get-a-reflection-vector
 * out = in - 2*(in*n) \cdot n
 * 
 * @param {Vec3} vec incoming vector  
 * @param {Vec3} n normalized(!) plane normal
 * @param {Vec3?} out must not be the same vector like vec(!)
 * @returns {Vec} out outcoming vector with same length as incoming vector 
 */
export function reflectVecOnPlane(vec, n, out=Vec3.create()){
    Vec3.mulScalar(n, 2*Vec3.dot(vec, n), out)
    Vec3.subtract(vec, out, out)
    return out
}

/**
 * 
 */
export function testPointInBox(){
    return true
}