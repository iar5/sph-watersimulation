/**
 * @param {Number} length 
 * @returns {Array} 
 */
export default dreiDimArr = function(length){

    result = []
    for(let i=0; i<length; i++){
        result[i] = []
        for(let j=0; j<length; j++){
            result[j][j] = []
            for(let k=0; k<length; k++){
                result[j][j][k] = 0
            }
        }
    }
}