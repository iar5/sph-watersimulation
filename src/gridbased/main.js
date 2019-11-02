import * as twgl from '../../lib/twgl/twgl.js';
import * as v3 from '../../lib/twgl/v3.js';
import * as m4 from '../../lib/twgl/m4.js';
import * as twglprimitives from '../../lib/twgl/primitives.js'
import {watersimulation} from './watersimulation.js'
import Stats from '../../lib/stats.js'



// SETUP WEBGL
const gl = document.getElementById("canvas").getContext("webgl2")
twgl.resizeCanvasToDisplaySize(gl.canvas)
twgl.setAttributePrefix("a_")
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
gl.enable(gl.DEPTH_TEST)
gl.enable(gl.BLEND)
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
gl.enable(gl.CULL_FACE)


// LOAD SHADER
var pointProgram 
const SHADER_DIR = '/src/gridbased/shader/'
loadTextResource(SHADER_DIR+'point.vs', (pvs) => {
    loadTextResource(SHADER_DIR+'point.fs', (pfs) => {
        pointProgram = twgl.createProgramInfo(gl, [pvs, pfs]);
        requestAnimationFrame(draw);
    })
})


// CAMERA
const fov = 35 * Math.PI / 180
const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
const zNear = 0.001
const zFar = 100
const projection = m4.perspective(fov, aspect, zNear, zFar)

const eye = [0, 0.5, -6]
const target = [0, 0, 0]
const up = [0, 1, 0]
const camera = m4.lookAt(eye, target, up)

const world = m4.identity() 

const stats = new Stats();
document.body.appendChild(stats.dom);
stats.dom.style.width = "initial"
stats.dom.style.height = "initial"

var lasttime = 0



/**
 * 
 * @param {Number} time timestamp
 */
function draw(time) {
    requestAnimationFrame(draw)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    stats.begin();

    let timestep = (time-lasttime)/1000 
    lasttime = time

    watersimulation.update(timestep)

    const view = m4.inverse(camera)
    const viewProjection = m4.multiply(projection, view)
    const uniforms = {
        u_viewInverse: camera,
        u_world: world,
        u_worldInverseTranspose: m4.transpose(m4.inverse(world)),
        u_worldViewProjection: m4.multiply(viewProjection, world),
    } 
    
    gl.useProgram(pointProgram.program);
    const waterBufferInfo = twgl.createBufferInfoFromArrays(gl, {position: watersimulation.getWaterDropsAsBufferArray()});
    twgl.setUniforms(pointProgram, uniforms);
    twgl.setBuffersAndAttributes(gl, pointProgram, waterBufferInfo);
    twgl.drawBufferInfo(gl, waterBufferInfo, gl.POINTS);
    
    stats.end();
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
    let newRotationMatrix = m4.create();
    m4.identity(newRotationMatrix);
    m4.rotateY(newRotationMatrix, -degToRad(deltaX / 5), newRotationMatrix);
    //m4.rotateX(newRotationMatrix, degToRad(deltaY / 5), newRotationMatrix);
    m4.multiply(newRotationMatrix, camera, camera);

    lastMouseX = newX
    lastMouseY = newY;
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

