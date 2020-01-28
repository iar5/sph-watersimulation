import HashGrid from '../../src/objects/HashGrid.js'


/**
 * Testing if grid size distanze 
 */
{
    const gridSize = 0.2
    const hashGrid = new HashGrid(gridSize)

    let k =  [0.5, 0.5, 0.5]
    let l = [k[0]+gridSize, k[1]+gridSize, k[2]+gridSize]
    hashGrid.add(k, k[0], k[1], k[2])
    hashGrid.add(l, l[0], l[1], l[2])

    let e = hashGrid.get(k[0], k[1], k[2])
    console.assert(e.length == 1)
}

/**
 * Testing half grid size distanze 
 */
{
    const gridSize = 0.2
    const hashGrid = new HashGrid(gridSize)

    let k =  [0.5, 0.5, 0.5]
    let l = [k[0]+gridSize/2, k[1]+gridSize/2, k[2]+gridSize/2]
    hashGrid.add(k, k[0], k[1], k[2])
    hashGrid.add(l, l[0], l[1], l[2])

    let e = hashGrid.get(k[0], k[1], k[2])    
    console.assert(e.length == 2)
}
