import * as Vec3 from "../../lib/twgl/v3.js";
import * as Mat4 from "../../lib/twgl/m4.js";

/**
 * Base class for 3D objects which holds the transformation matrix
 * Extend with additional Mat4 methods if needed
 */
export default class Object3D {

    modelMat = Mat4.identity()

    scale(vec){
        Mat4.scale(this.modelMat, vec, this.modelMat)
    }

    translate(vec){
        Mat4.translate(this.modelMat, vec, this.modelMat)
    }

    rotateX(rad){
        Mat4.rotateX(this.modelMat, rad, this.modelMat)
    }

    setTranslation(vec){
        Mat4.setTranslation(this.modelMat, vec, this.modelMat)
    }

    /**
     * 
     * @param {Vec3} dst 
     * @returns {Vec3} dst
     */
    getTranslation(dst){
        Mat4.getTranslation(this.modelMat, dst)
        return dst
    }
}