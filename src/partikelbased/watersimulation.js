/**
 * @author Tom Wendland
 * 
 * Force abh von Timestep
 * Wenn tab gewechselt wird Timestep riesig
 * Timestep kosntatn setzen? Listener?
 * pplyForceaus update raus nehemen
 * !!! Matrizen richtig machen. Irgendeine Seite ist immer gespiegelt. Wie Licht etc handeln?
 * */


import * as Vec3 from '../../lib/twgl/v3.js'
import { Drop } from './objects/Drop.js'
import { Sphere } from './objects/Sphere.js'
import { Pool } from './objects/Pool.js'
import { Emitter } from './objects/Emitter.js'


export const watersimulation = (function (){

    const force = [0, -0.0981, 0]

    const drops = []

    const pool = new Pool(Vec3.create(0, -1, 0), 2, 2, 1)
    const sphere = new Sphere(Vec3.create(0, 0, 0), 0.4)
    const emitter = new Emitter(Vec3.create(0, 3, 0), drops, 100)


    /**
     * 
     * @param {Number} tstep timestep
     */
    function update(tstep){ 

        sphere.update(tstep)
        emitter.update(tstep)

        // SIMULATION
        let i = drops.length
        while (i--) {
            let drop = drops[i]

            // APLLYING FORCES
            let f = Vec3.mulScalar(force, tstep)
            drop.update(tstep, f)

            // COLLISION 
            sphere.collide(drop)
            pool.collide(drop)
            
            // REMOVE DROPS OUTSIDE OF THE VIEW
            if (drop.pos[1] < -3) { 
                drops.splice(i, 1);                
                drop.free()
            } 
        }        
    }

    /**
     * transforms array vector to continous position buffer array 
     * @returns {Array} 
     */
    function getWaterDropsAsBufferArray(){
        let result = []
        for(let drop of drops){
            result.push(drop.pos[0], drop.pos[1], drop.pos[2])
        }
        return result
    }


    // PUBLIC METHODS 
    return {
        update,
        getWaterDropsAsBufferArray,
        getSphere(){
            return sphere
        },
        getPool(){
            return pool
        },
    }
})()