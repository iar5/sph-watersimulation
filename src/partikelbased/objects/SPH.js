import * as Vec3 from "./../../../lib/twgl/v3.js";
import * as Mat4 from "./../../../lib/twgl/m4.js";
import Vec3Factory from "./Vec3Factory.js";


export class SPH {

    /**
     * @param {Array} drops reference to all drops
     */
    constructor(drops){
        this.drops = drops
    }

    update(){

        for(let drop of this.drops){
            let density = SPH.calculateDensity(this.drops, drop.pos)
            let presure = SPH.calculatePresure(density)
            
            //const vt = 
        }

    }

    /**
     * calculates fluid density at a given point with a smoothing kernel
     * @param {Array} drops
     * @param {Vec3} pos
     * @returns {Vec3} 
     */
    static calculateDensity(drops, pos){
        const h = 1
        const POLY6 = 315 / 64 * Math.PI * h
        let sum = 0

        for(let drop of drops){
            let r = Vec3.length(Vec3.subtract(pos, drop.pos))

            if(r < h){
                sum += drop.m * POLY6 * Math.pow(h - r, 3)
            }
        }

        return sum
    }

    /**
     * 
     * @param {Vec3} densityAtPos 
     * @returns {Vec3} 
     */
    static calculatePresure(densityAtPos){
        const k = 1
        return k*densityAtPos
    }
}