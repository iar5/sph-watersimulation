/**
 * @author Tom Wendland
 * 
 * Idee: für temporäre Berechnung erstellte Vec3`s nach Benutzung freigeben und nicht benutzte Vec3`s verwenden, anstatt neue zu erstellen
 * Todo: Einbindung in Vec3 Klasse
 * - in Vec3 Klasse alle new Vec3Type() mit Vec3Factory.create() ersetzen
 * - muss dann aber auch dran denken alle Vec3 freizugeben, z.B. mit neuer Methode Vec3.free()
 */

import * as Vec3 from "./twgl/v3.js";

export default (function(){

    const vecs = []

    return{
        add(...vs){
            for(let v of vs)
                vecs.push(v)                                    
        },
        create(x=0, y=0, z=0){            
            let l = vecs.length
            if(l > 0){
                let v = vecs[l-1] 
                vecs.splice(l-1, 1);
                v[0]=x, v[1]=y, v[2]=z
                return v
            }
            else return Vec3.create(x, y, z) 
        }
    }
})()