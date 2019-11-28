import * as Vec3 from '../../lib/twgl/v3.js';
import * as Mat4 from '../../lib/twgl/m4.js';


export const simulation = (function (){

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
                let drop = Vec3.create(
                    w + 1/cells/2,
                    h + 1/cells/2,
                    d + 1/cells/2
                )
                drops.push(drop)
            }
        }
    }
    
    /**
     * 
     * @param {Number} dt timestep
     */
    function update(dt){ 

    }



    // PUBLIC METHODS 
    return {
        update,

        /**
         * transforms array vector to continous position buffer array 
         * @returns {Array} 
         */
        getPoints(){
            let result = []
            for(let drop of drops){
                result.push(drop[0], drop[1], drop[2])
            }
            return result
        }    
    }
})()


function dreiDimArr(length){
    var result = []
    for(let i=0; i<length; i++){
        result[i] = []
        for(let j=0; j<length; j++){
            result[j][j] = []
            for(let k=0; k<length; k++){
                result[j][j][k] = 0
            }
        }
    }
    return result;
}