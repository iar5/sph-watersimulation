import * as Vec3 from '../../lib/twgl/v3.js';
import * as Mat4 from '../../lib/twgl/m4.js';
import {dreiDimArr} from './utils.js'


export const watersimulation = (function (){

    const force = [0, -9.81, 0]
    const drops = []

    const width = 2
    const height = 2
    const depth = 2
    const cells = 4

    const density = []
    const velocity = dreiDimArr()


    for(let w=-width/2; w<width/2; w+= 1/cells){
        for(let h=-height/2; h<height/2; h+= 1/cells){
            for(let d=-depth/2; d<depth/2; d += 1/cells){
                let d = Vec3.create(
                    w + 1/cells/2,
                    h + 1/cells/2,
                    d + 1/cells/2
                )
                drops.push(d)
            }
        }
    }
    
    /**
     * 
     * @param {Number} tstep timestep
     */
    function update(tstep){ 

    }



    // PUBLIC METHODS 
    return {
        update,

        /**
         * transforms array vector to continous position buffer array 
         * @returns {Array} 
         */
        getWaterDropsAsBufferArray(){
            let result = []
            for(let drop of drops){
                result.push(drop[0], drop[1], drop[2])
            }
            return result
        }    
    }
})()