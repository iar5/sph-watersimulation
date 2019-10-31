import * as Vec3 from '../lib/twgl/v3.js'
import Vec3Factory from './objects/Vec3Factory.js'
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
     * @param {Number} time timestamp
     * @param {Number} t timestep
     */
    function update(time, t){ 

        sphere.update(time)
        emitter.update(time, t)

        // SIMULATION
        let i = drops.length
        while (i--) {
            let drop = drops[i]

            // APLLYING FORCES
            let f = Vec3.mulScalar(force, t)
            drop.update(t, f)

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
        result.push(sphere.pos[0], sphere.pos[1], sphere.pos[2])
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