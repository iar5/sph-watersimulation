import * as twgl from '../lib/twgl/twgl.js'
import * as twglprimitives from '../lib/twgl/primitives.js'
import * as v3 from '../lib/twgl/v3.js'
import * as m4 from '../lib/twgl/m4.js'
import Stats from '../lib/stats.module.js'
import { simulation } from './simulation.js'
import { point_vs, point_fs } from './shader/point.js'
import { basic_vs, basic_fs } from './shader/basic.js'
import { diffus_vs, diffus_fs } from './shader/diffus.js'




//////////////////
//     GUI      //
//////////////////
const stats = new Stats()
document.body.appendChild(stats.dom)

var pause = false


//////////////////
//  SETUP WEBGL //
//////////////////
const canvas = document.getElementById("canvas")
const gl = canvas.getContext("webgl2")
twgl.resizeCanvasToDisplaySize(gl.canvas)
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
gl.enable(gl.CULL_FACE)
gl.enable(gl.BLEND)
gl.enable(gl.DEPTH_TEST)
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

const pointProgram = twgl.createProgramInfo(gl, [point_vs, point_fs])
const basicProgram = twgl.createProgramInfo(gl, [basic_vs, basic_fs])
const diffusProgram = twgl.createProgramInfo(gl, [diffus_vs, diffus_fs])
requestAnimationFrame(render)



//////////////////
// PRIMMITIVES  //
//////////////////
twgl.setAttributePrefix("a_")
const sphereBufferInfo = twglprimitives.createSphereBufferInfo(gl, 1, 12, 12)
const planeBufferInfo = twglprimitives.createPlaneBufferInfo(gl, 1, 1, 2, 2)
twgl.setAttributePrefix("") 



//////////////////
//    CAMERA    //
//////////////////
var fov = 35 * Math.PI / 180
var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
var near = 0.001
var far = 100
const projection = m4.perspective(fov, aspect, near, far)
const camera = m4.translation([0, 0, 6])



//////////////////
//   UNIFORMS   //
//////////////////
const lightuniform = {
    ambient: [0.3, 0.3, 0.3],
    sunColor: [0.8, 0.8, 0.8],
    sunPosition: [-2.0, 3.0, 2.0],
}

const globalUniforms = {
    u_projection: projection,
    u_view: m4.inverse(camera),
} 




/**
 * @param {Number} time timestamp (first parameter of requestAnimationFrame())
 */
function render(time) {
    requestAnimationFrame(render)
    stats.begin()
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    m4.inverse(camera, globalUniforms.u_view)
    
    if(!pause)  simulation.update() 

    const drops = simulation.getDrops()
    const dropsPos = []
    const dropsColor = []
    drops.forEach(drop => {
        dropsPos.push(drop.pos[0], drop.pos[1], drop.pos[2])
        dropsColor.push(0.1, 0.1, 1-(drop.rho-0.8)*5, 1)
    })  

    gl.useProgram(pointProgram.program)
    const waterBufferInfo = twgl.createBufferInfoFromArrays(gl, {
        a_position: { numComponents: 3, data: dropsPos },
        a_color: { numComponents: 4, data: dropsColor }
    })
    twgl.setUniforms(pointProgram, globalUniforms)
    twgl.setUniforms(pointProgram, { u_model: m4.IDENTITY })
    twgl.setBuffersAndAttributes(gl, pointProgram, waterBufferInfo)
    twgl.drawBufferInfo(gl, waterBufferInfo, gl.POINTS)

    /*drops.forEach(drop => {
        let modelMat = m4.identity()
        m4.translate(modelMat, drop.pos, modelMat)
        m4.scale(modelMat, [0.03, 0.03, 0.03], modelMat)
        gl.useProgram(basicProgram.program)
        twgl.setUniforms(basicProgram, globalUniforms)
        twgl.setUniforms(basicProgram, { u_model: modelMat, u_color: [0, 0, 1, 1]})
        twgl.setBuffersAndAttributes(gl, basicProgram, sphereBufferInfo)
        twgl.drawBufferInfo(gl, sphereBufferInfo, gl.TRIANGLES)
    })*/

    let sphere = simulation.getSphere()
    gl.useProgram(diffusProgram.program)
    twgl.setUniforms(diffusProgram, globalUniforms)
    twgl.setUniforms(diffusProgram, lightuniform)
    twgl.setUniforms(diffusProgram, { u_model: sphere.modelMat, u_color: sphere.color })
    twgl.setBuffersAndAttributes(gl, diffusProgram, sphereBufferInfo)
    twgl.drawBufferInfo(gl, sphereBufferInfo, gl.TRIANGLES)

    // TODO backfaces werden nicht gemalt
    let plane = simulation.getPlane()
    gl.useProgram(diffusProgram.program)
    twgl.setUniforms(diffusProgram, globalUniforms)
    twgl.setUniforms(diffusProgram, lightuniform)
    twgl.setUniforms(diffusProgram, { u_model: plane.modelMat, u_color: plane.color })
    twgl.setBuffersAndAttributes(gl, diffusProgram, planeBufferInfo)
    twgl.drawBufferInfo(gl, planeBufferInfo, gl.TRIANGLES)

    stats.end()
}


/**
 * 
 */
window.addEventListener("resize", e => {
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight)
    twgl.resizeCanvasToDisplaySize(canvas)
    aspect = canvas.clientWidth / canvas.clientHeight    
    m4.perspective(fov, aspect, near, far, projection)
})

/**
 * Key listener to pause simulation
 */
document.addEventListener("keydown", e => {
    if(e.keyCode == 32){ // leeertaste
        pause = !pause
    }
})


/**
 * Mouse controls
 * by http://learningwebgl.com/blog/?p=1253
 */
var mouseDown
var lastMouseX
var lastMouseY
canvas.onmousedown = function(e) {
    mouseDown = true
    lastMouseX = e.clientX
    lastMouseY = e.clientY
}
document.onmouseup = function(e) { mouseDown = false }
document.onmousemove = function(e) {
    if (!mouseDown) return
    let newX = e.clientX
    let newY = e.clientY
    let deltaX = newX - lastMouseX
    let deltaY = newY - lastMouseY
    lastMouseX = newX
    lastMouseY = newY
    let rotationMat = m4.identity()
    m4.rotateY(rotationMat, -degToRad(deltaX / 5), rotationMat)
    m4.multiply(rotationMat, camera, camera)
}

/**
 * 
 * @param {Number} degrees 
 * @returns {Number} radians
 */
function degToRad(degrees) {
    return degrees * Math.PI / 180
}

