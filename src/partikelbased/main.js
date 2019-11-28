/**
 * @author Tom Wendland
 * 
 * Idee:
 * - 
 */

import * as twgl from '../../lib/twgl/twgl.js';
import * as v3 from '../../lib/twgl/v3.js';
import * as m4 from '../../lib/twgl/m4.js';
import * as twglprimitives from '../../lib/twgl/primitives.js'
import { simulation } from './simulation.js'
import Stats from '../../lib/stats.js'


//////////////////
//  SETUP WEBGL //
//////////////////
const canvas = document.getElementById("canvas")
const gl = canvas.getContext("webgl2")
twgl.resizeCanvasToDisplaySize(gl.canvas)
twgl.setAttributePrefix("a_")
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
const SHADER_DIR = '/shader/'
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
const fov = 35 * Math.PI / 180
const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
const near = 0.001
const far = 100
const projection = m4.perspective(fov, aspect, near, far)
const camera = m4.translation([0, 0, 6]) // guckt nach -z. iverse wäre welt koordinaten, eins reicht also. werden beide als view zusammengefasst

const stats = new Stats();
document.body.appendChild(stats.dom);

var pause = false



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
let sphereBufferInfo = twglprimitives.createSphereBufferInfo(gl, 1, 12, 12)



/**
 * 
 * @param {Number} time timestamp von requestAnimationFrame
 */
function render(time) {
    requestAnimationFrame(render)

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    twgl.resizeCanvasToDisplaySize(canvas)

    stats.begin();
    
    if(!pause) simulation.update(1/60) 
    
    const uniforms = {
        u_projection: projection,
        u_view: m4.inverse(camera),
        u_model: m4.identity() // placeholder
    } 
    
    
    // transparency only working when order of drawing objects is correct
    gl.useProgram(pointProgram.program);
    const waterBufferInfo = twgl.createBufferInfoFromArrays(gl, {position: simulation.getPoints()});
    twgl.setUniforms(pointProgram, uniforms);
    let waterModelMat = m4.identity();
    m4.translate(waterModelMat, [0, 0, 0], waterModelMat)    
    twgl.setUniforms(pointProgram, {u_model: waterModelMat});
    twgl.setBuffersAndAttributes(gl, pointProgram, waterBufferInfo);
    twgl.drawBufferInfo(gl, waterBufferInfo, gl.POINTS);

    gl.useProgram(diffusProgram.program);
    twgl.setUniforms(diffusProgram, uniforms);
    twgl.setUniforms(diffusProgram, lightuniform);
    let sphereModelMat = m4.identity();
    let r = simulation.getSphere().r
    m4.scale(sphereModelMat, v3.create(r, r, r), sphereModelMat)
    m4.translate(sphereModelMat, simulation.getSphere().pos, sphereModelMat)    
    twgl.setUniforms(diffusProgram, {u_model: sphereModelMat});
    twgl.setBuffersAndAttributes(gl, diffusProgram, sphereBufferInfo);
    twgl.drawBufferInfo(gl, sphereBufferInfo, gl.TRIANGLES);

    stats.end();
}


/**
 * Key listener to pause simulation
 */
document.addEventListener("keydown", e => {
    if(e.keyCode == 32){
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


/**
 * Loads (local) textfile
 * @param {String} url 
 * @param {Callback} callback 
 */
function loadTextResource(url, callback) {
	const request = new XMLHttpRequest()
	request.open('GET', url + '?please-dont-cache=' + Math.random(), true)
	request.onload = function () {
		callback(request.responseText)
	}
	request.send()
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

