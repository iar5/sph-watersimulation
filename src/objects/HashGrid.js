/**
 * @author Tom Wendland
 * 
 * https://www.gamedev.net/forums/topic.asp?topic_id=567378
 * 
 * Vorgehen
 * - Position auf Nummer hashen
 * - Hash Table Mit Hash:[partikels]
 * - Für alle Tabelleneinträge dann SPH mit den beinhalteten Partikeln + deren 26 Nachbarvoxeln
 * 
 * Notes
 * - Duplikate nicht möglich da unique hash
 * - max integer oder sowas wird nicht beachtet
 */


const RANGE = [-1, 0, 1] // für neighbour loop später, performance

export class HashGrid{
    
    table = new Map()

    /**
     * 
     * @param {Number} width 
     * @param {Number} height 
     * @param {Number} depth 
     * @param {Number} cell_size mindestens partikel durchmesser      
     */
    constructor(width, height, depth, cell_size) {
        this.W = width
        this.H = height
        this.D = depth
        this.gridSize = cell_size 
    }

    encode(x, y, z){
        let ex = x/W
        let ey = y/H
        let ez = z/D
        return ex + (ey * W) + (ez * W * H)
    }
    decode(hash){
        let ex = hash % (W*H) % W 
        let ey = (hash % (W*H)) / W 
        let ez = hash / (W * H)

        let x = (ex * gridSize) + (gridSize * 0.5) 
        let y = (ey * gridSize) + (gridSize * 0.5) 
        let z = (ez * gridSize) + (gridSize * 0.5) 

        return [x, y, z]
    }
    add(obj, x, y, z){
        if(!this.checkBoundaries()) return
        let hash = this.encode(x, y, z)

        if(this.table.has(hash)){
            let arr = []
            arr.push(obj)
            table.add(hash, arr)
        }
        else{
            let arr = this.table.get(hash)
            arr.push(obj)
        }
    } 
    get(x, y, z){
        if(!this.checkBoundaries()) return
        let hash = this.encode(x, y, z)
        return table.get(hash)
    }
    getEntriesAndNeighbours(x, y, z){
        let result = []
        for(let rx in RANGE){
            for(let ry in RANGE){
                for(let rz in RANGE){
                    let arr = this.get(x+rx, y+ry, z+rz)
                    result.add(...arr) 
                }
            }
        }
        return result
    }
    checkBoundaries(x, y, z){
        if(
            x<W || x>W ||
            y<H || y>H ||
            z<W || z>D
        ) {
            console.log("Incorect position");
            return false
        }
        else
            return true
    }
    clear(){
        this.table.clear()
    }
}