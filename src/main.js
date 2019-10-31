import * as twgl from './../lib/twgl/twgl.js';
import * as v3 from './../lib/twgl/v3.js';
import * as m4 from './../lib/twgl/m4.js';
import * as twglprimitives from './../lib/twgl/primitives.js'
import {watersimulation} from './watersimulation.js'
import Stats from '/lib/stats.js'



// SETUP WEBGL
const gl = document.getElementById("canvas").getContext("webgl2")
twgl.resizeCanvasToDisplaySize(gl.canvas)
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
gl.enable(gl.DEPTH_TEST)
gl.enable(gl.BLEND)
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
gl.enable(gl.CULL_FACE)


// LOAD SHADER
var pointProgram 
var diffusProgram 
loadTextResource('/src/shader/point.vs', (pvs) => {
    loadTextResource('/src/shader/point.fs', (pfs) => {
        loadTextResource('/src/shader/diffus.vs', (dvs) => {
            loadTextResource('/src/shader/diffus.fs', (dfs) => {
                pointProgram = twgl.createProgramInfo(gl, [pvs, pfs]);
                diffusProgram = twgl.createProgramInfo(gl, [dvs, dfs]);
                requestAnimationFrame(draw);
            })
        })
    })
})

// SPHERE BUFFER
let sphereBufferInfo = twglprimitives.createSphereBufferInfo(gl, 0.4, 12, 12)
sphereBufferInfo.attribs["a_position"] = sphereBufferInfo.attribs["position"]
sphereBufferInfo.attribs["a_normal"] = sphereBufferInfo.attribs["normal"]
delete sphereBufferInfo.attribs["position"]
delete sphereBufferInfo.attribs["normal"]
delete sphereBufferInfo.attribs["texcoord"]


// CAMERA
const fov = 35 * Math.PI / 180
const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
const zNear = 0.001
const zFar = 100
const projection = m4.perspective(fov, aspect, zNear, zFar)

const eye = [0, 0, -6]
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
    stats.begin();

    let t = (time-lasttime)/1000 // timestep
    lasttime = time

    watersimulation.update(time, t)

    const view = m4.inverse(camera)
    const viewProjection = m4.multiply(projection, view)
    const uniforms = {
        u_viewInverse: camera,
        u_world: world,
        u_worldInverseTranspose: m4.transpose(m4.inverse(world)),
        u_worldViewProjection: m4.multiply(viewProjection, world),
    } 
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    const waterBufferInfo = twgl.createBufferInfoFromArrays(gl, {a_position: watersimulation.getWaterDropsAsBufferArray()});
    gl.useProgram(pointProgram.program);
    twgl.setUniforms(pointProgram, uniforms);
    twgl.setBuffersAndAttributes(gl, pointProgram, waterBufferInfo);
    twgl.drawBufferInfo(gl, waterBufferInfo, gl.POINTS);

    gl.useProgram(diffusProgram.program);
    twgl.setUniforms(diffusProgram, uniforms);
    twgl.setUniforms(diffusProgram, {u_model: m4.translation([watersimulation.getSphere().pos[0], 0, 0])});
    twgl.setBuffersAndAttributes(gl, diffusProgram, sphereBufferInfo);
    twgl.drawBufferInfo(gl, sphereBufferInfo, gl.TRIANGLES);

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

