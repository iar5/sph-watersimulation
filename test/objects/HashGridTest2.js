import HashGrid from '../../src/objects/HashGrid.js'

const gridSize = 0.2
const hashGrid = new HashGrid(gridSize)

for(let i=0; i<20; i++){
    let pos = [Math.random(), Math.random(), Math.random()]
    hashGrid.add(pos, pos[0], pos[1], pos[2])
}

let k =  [0.5, 0.5, 0.5]
let l = [k[0]+gridSize, k[1]+gridSize, k[2]+gridSize]
hashGrid.add(k, k[0], k[1], k[2])
hashGrid.add(l, l[0], l[1], l[2])


let e = hashGrid.get(k[0], k[1], k[2])
console.log(e)
let a = hashGrid.getEntriesAndNeighbours(k[0], k[1], k[2])
console.log(a)
