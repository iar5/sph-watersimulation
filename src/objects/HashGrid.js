/**
 * @author Tom Wendland
 * 
 * http://www.hugi.scene.org/online/coding/hugi%2032%20-%20coding%20corner%20jezeus%20hash%20maps%20for%20physical%20based%20simulations.htm * 
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
    
    map = new Map()

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
        return (ex*73856093 + ey*19349663 + ez*83492791)
    }

    decode(){
        // https://www.gamedev.net/forums/topic.asp?topic_id=567378
        console.log("HashGrid.decode() not implemented yet");
        
    }

    add(obj, x, y, z){
        let hash = this.encode(x, y, z)

        if(this.map.has(hash)){
            let arr = this.map.get(hash)
            arr.push(obj)
        }
        else{  
            let arr = []
            arr.push(obj)
            this.map.set(hash, arr)          
        }              
    } 

    get(x, y, z){
        let hash = this.encode(x, y, z)
        return this.map.get(hash)
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
        this.map.clear()
    }
}