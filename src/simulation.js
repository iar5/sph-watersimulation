/**
 * @author Tom Wendland
 * SPH simulation solver
 * parameters: https://scicomp.stackexchange.com/questions/14450/how-to-get-proper-parameters-of-sph-simulation
 * */

import * as Vec3 from '../lib/twgl/v3.js'
import { Drop } from './objects/Drop.js'
import { Sphere } from './objects/Sphere.js'
import { Pool } from './objects/Pool.js'
import { Emitter } from './objects/Emitter.js'


export const TIMESTEP = 0.00002 // dt

const EXTERNAL_FORCES = [0, -9.81*12000, 0] // m/s
const REST_DENS  = 1000 // dichte von wasser 993 kg/m^3
const GAS_CONST = 2000 // stiffness, Nm/kg
const VISC = 0.1 // Ns/m^2

const PARTICLE_RADIUS = 0.03 // m
const PARTICLE_MASS = PARTICLE_RADIUS*PARTICLE_RADIUS * REST_DENS / (8*12*8) // kg

const H = PARTICLE_RADIUS*2 // kernel radius
const HSQ = H*H
const POLY6 = 315/(65*Math.PI*Math.pow(H,9))
const SPIKY_GRAD = -45/(Math.PI*Math.pow(H,6))
const VISC_LAP = 45/(Math.PI*Math.pow(H,6));



const pool = new Pool(Vec3.create(), 1, 3, 1)
const sphere = new Sphere(Vec3.create(), 0.4)
const drops = Emitter.createDropCube(Vec3.create(), 8, 12, 8, PARTICLE_RADIUS*2)


// predefined vectors for optimisation
const fpress = Vec3.create() // pressure force
const fvisc = Vec3.create() // viscosity force
const fgrav = Vec3.create() // grav force
const f = Vec3.create() // sum force
const rij = Vec3.create() // difference between drop i and j
const rvij = Vec3.create() // difference in velocity between drop i and j
const v = Vec3.create() // velocity
const x = Vec3.create() // position

function update(){ 
    for(let di of drops){
        // density
        di.rho = 0
        for(let dj of drops){
            let r2 = Vec3.distanceSq(di.pos, dj.pos)
            if(r2 < HSQ){
                di.rho += PARTICLE_MASS * POLY6 * Math.pow(HSQ - r2, 3)
            }
        }
        // presure
        di.p = GAS_CONST * (di.rho - REST_DENS);
    }
    

    for(let pi of drops){

        Vec3.reset(f)
        Vec3.reset(fgrav)
        Vec3.reset(fpress)
        Vec3.reset(fvisc)

        for(let pj of drops){
            if(pi === pj) continue

            Vec3.subtract(pj.pos, pi.pos, rij)
            let r = Vec3.length(rij)
            if(r < H){
                // compute pressure force contribution
                //fpress += -rij.normalized()*MASS * (pi.p + pj.p)/(2.f * pj.rho) * SPIKY_GRAD*pow(H-r,2.f);
                Vec3.normalize(rij, rij)
                Vec3.mulScalar(rij, - PARTICLE_MASS * (pi.p + pj.p)/(2*pj.rho) * SPIKY_GRAD * Math.pow(H-r, 2), rij)
                Vec3.add(fpress, rij, fpress)

                // compute viscosity force contribution
                //fvisc += VISC*MASS*(pj.v - pi.v)/pj.rho * VISC_LAP*(H-r);
                let t1 = VISC * PARTICLE_MASS 
                var t2 = 1/pj.rho * VISC_LAP * (H-r)
                Vec3.subtract(pj.v, pi.v, rvij)

                Vec3.mulScalar(rvij, t1, rvij)
                Vec3.mulScalar(rvij, t2, rvij)
                Vec3.add(fvisc, rvij, fvisc)
            }
        }

        Vec3.mulScalar(EXTERNAL_FORCES, pi.rho, fgrav)
        Vec3.add(f, fpress, f)
        Vec3.add(f, fvisc, f)
        Vec3.add(f, fgrav, f)
        
        Vec3.copy(f, pi.f)
    }


    for(let p of drops){
        // forward Euler 
        // p.v += DT*p.f/p.rho;
        Vec3.mulScalar(p.f, TIMESTEP/p.rho, v) // acc calculated by force
        Vec3.add(p.v, v, p.v)

        // p.x += DT*p.v;
        Vec3.mulScalar(p.v, TIMESTEP, x)
        Vec3.add(p.pos, x, p.pos)

        pool.collide(p)
        sphere.collide(p)
    }
}




export const simulation = (function (){

    return {
        update,
        getDrops(){
            return drops
        },
        getSphere(){
            return sphere 
        },
    }
})()



