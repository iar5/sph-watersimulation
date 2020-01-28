/**
 * @author Tom Wendland
 * 
 * http://www.hugi.scene.org/online/coding/hugi%2032%20-%20coding%20corner%20jezeus%20hash%20tables%20for%20physical%20based%20simulations.htm * 
 *
 * Vorgehen
 * - Alle Positionen in einer Zelle auf gleiche Nummer hashen
 * - Map<Hash, Array<Drops>>
 * - Für alle Tabelleneinträge dann SPH mit den beinhalteten Partikeln + deren 26 NachbarZellen
 * 
 * Probleme, Hinweise
 * - Max integer oder sowas wird nicht beachtet
 * - Wird negativ beachtet?
 */



export default class HashGrid{
    
    table = new Map()

    /**
     * 
     * @param {Number} cell_size mindestens partikel durchmesser      
     */
    constructor(cell_size) {
        this.gridSize = cell_size 
        this.iterRange = [-cell_size, 0, cell_size]
    }

    encode(x, y, z){
        let ex = Math.floor(x/this.gridSize)
        let ey = Math.floor(y/this.gridSize)
        let ez = Math.floor(z/this.gridSize)
        return (73856093 * ex + 19349663 * ey + 83492791 * ez)
    }

    add(obj, x, y, z){
        let hash = this.encode(x, y, z)

        if(this.table.has(hash)){
            let arr = this.table.get(hash)
            arr.push(obj)
        }
        else{  
            let arr = []
            arr.push(obj)
            this.table.set(hash, arr)          
        }              
    } 

    get(x, y, z){
        let hash = this.encode(x, y, z)
        return this.table.get(hash)
    }

    getEntriesAndNeighbours(x, y, z){
        let result = []
        for(let rx of this.iterRange)
        for(let ry of this.iterRange)
        for(let rz of this.iterRange){
            let arr = this.get(x+rx, y+ry, z+rz)
            if(arr){   
                result.push(...arr)                    
            }  
        }
        return result
    }

    clear(){
        this.table.clear()
    }
}