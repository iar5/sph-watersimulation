import * as Vec3 from "./../../../lib/twgl/v3.js";

/**
 * TODO
 * in Vec3 Klasse einbinden
 * temporär zur Berechnung benutze Vec3`s nach Benutzung freigeben
 */
export default (function(){

    const vecs = []

    return{
        add(...vs){
            for(let v of vs)
                vecs.push(v)                                    
        },
        create(x = 0, y = 0, z = 0){            
            let l = vecs.length
            if(l > 0){
                let v = vecs[l-1] 
                vecs.splice(l-1, 1);
                v[0] = x, v[1] = y, v[2] = z
                return v
            }
            else return Vec3.create(x, y, z) 
        }
    }
})()

