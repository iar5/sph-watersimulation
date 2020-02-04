import * as Vec3 from "./../lib/twgl/v3.js"
import { intersectSegmentPlane, reflectVecOnPlane, EPSILON } from "./../src/tools/collision.js"

let x = Vec3.create(Math.random(), Math.random(), Math.random())
let n = Vec3.create(0, 1, 0)

let rr = Vec3.create(Math.random(), Math.random(), Math.random())

let r = reflectVecOnPlane(rr, n, rr)

console.log(rr);
console.log(r);

