/**
 * @author Tom Wendland
 * 
 * Hinweise:
 * - Transparency klappt nur wenn Reihenfolge des Zeichnens der Objekte korrekt ist
 * 
 * Aufgaben:
 * - Canvas und WebGL Setup
 * - Controls
 * - Rendering
 */

import * as twgl from '../lib/twgl/twgl.js';
import * as twglprimitives from '../lib/twgl/primitives.js'
import * as v3 from '../lib/twgl/v3.js';
import * as m4 from '../lib/twgl/m4.js';
import Stats from '../lib/stats.js'
import { degToRad, loadTextResource } from './tools//utils.js'
import { simulation } from './simulation.js'




//////////////////
//     GUI      //
//////////////////
const stats = new Stats();
document.body.appendChild(stats.dom);

var pause = false
var framecount = 0
var infoEl = document.getElementById("myinfo")



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



//////////////////
//  LOAD SHADER //
//////////////////
var pointProgram 
var diffusProgram 

const SHADER_DIR = '/src/shader/'
loadTextResource(SHADER_DIR+'point.vs', (pvs) => {
    loadTextResource(SHADER_DIR+'point.fs', (pfs) => {
        loadTextResource(SHADER_DIR+'diffus.vs', (dvs) => {
            loadTextResource(SHADER_DIR+'diffus.fs', (dfs) => {
                pointProgram = twgl.createProgramInfo(gl, [pvs, pfs]);
                diffusProgram = twgl.createProgramInfo(gl, [dvs, dfs]);
                requestAnimationFrame(render);
            })
        })
    })
})



//////////////////
//    CAMERA    //
//////////////////
var fov = 35 * Math.PI / 180
var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
var near = 0.001
var far = 100
const projection = m4.perspective(fov, aspect, near, far)
const camera = m4.translation([0, 0, 6]) // guckt nach -z. iverse wäre welt koordinaten, eins reicht also. werden beide als view zusammengefasst



//////////////////
//     LIGHT    //
//////////////////
const lightuniform = {
    ambient: [0.3, 0.3, 0.3],
    sunColor: [0.8, 0.8, 0.8],
    sunPosition: [2.0, 3.0, 2.0],
}



//////////////////
//    SPHERE    //
//////////////////
twgl.setAttributePrefix("a_")
let sphereBufferInfo = twglprimitives.createSphereBufferInfo(gl, 1, 12, 12)
twgl.setAttributePrefix("")



/**
 * @param {Number} time timestamp von requestAnimationFrame
 */
function render(time) {
    requestAnimationFrame(render)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    framecount++
    infoEl.innerHTML = framecount

    stats.begin();
    
    if(!pause) simulation.update() 
    
    const globalUniforms = {
        u_projection: projection,
        u_view: m4.inverse(camera),
        u_model: m4.identity() // placeholder
    } 
    
    

    const drops = simulation.getDrops()
    const dropsPos = []
    for(let drop of drops){
        dropsPos.push(drop.pos[0], drop.pos[1], drop.pos[2])
    }
    const dropsColor = []
    for(let drop of drops){
        dropsColor.push(0.1, 0.1, 1-(drop.rho-1.47)*5, 1)
    }
    
    gl.useProgram(pointProgram.program);
    const waterBufferInfo = twgl.createBufferInfoFromArrays(gl, {
        a_position: { numComponents: 3, data: dropsPos },
        a_color: { numComponents: 4, data: dropsColor }
    });  
    let waterModelMat = m4.identity();
    m4.translate(waterModelMat, [0, 0, 0], waterModelMat)  
    twgl.setUniforms(pointProgram, globalUniforms);
    twgl.setUniforms(pointProgram, {
        u_model: waterModelMat
    });
    twgl.setBuffersAndAttributes(gl, pointProgram, waterBufferInfo);
    twgl.drawBufferInfo(gl, waterBufferInfo, gl.POINTS);

    let sphere = simulation.getSphere()
    let sphereModelMat = m4.identity();
    m4.translate(sphereModelMat, simulation.getSphere().pos, sphereModelMat)   
    m4.scale(sphereModelMat, v3.create(sphere.r, sphere.r, sphere.r), sphereModelMat)
    gl.useProgram(diffusProgram.program);
    twgl.setUniforms(diffusProgram, globalUniforms);
    twgl.setUniforms(diffusProgram, lightuniform);
    twgl.setUniforms(diffusProgram, {
        u_model: sphereModelMat,
        u_color: sphere.color
    });
    twgl.setBuffersAndAttributes(gl, diffusProgram, sphereBufferInfo);
    twgl.drawBufferInfo(gl, sphereBufferInfo, gl.TRIANGLES);

    stats.end();
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
var mouseDown;
var lastMouseX;
var lastMouseY;
canvas.onmousedown = function(e) {
    mouseDown = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
}
document.onmouseup = function(e) { mouseDown = false }
document.onmousemove = function(e) {
    if (!mouseDown) return;
    let newX = e.clientX;
    let newY = e.clientY;
    let deltaX = newX - lastMouseX;
    let deltaY = newY - lastMouseY;
    lastMouseX = newX
    lastMouseY = newY;
    let newRotationMatrix = m4.create();
    m4.identity(newRotationMatrix);
    m4.rotateY(newRotationMatrix, -degToRad(deltaX / 5), newRotationMatrix);
    //m4.rotateX(newRotationMatrix, -degToRad(deltaY / 5), newRotationMatrix);
    m4.multiply(newRotationMatrix, camera, camera);
}


