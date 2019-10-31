precision highp float;

uniform mat4 u_world;
uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;
uniform mat4 u_viewInverse;
uniform mat4 u_model;

attribute vec3 a_position;
attribute vec3 a_normal;

varying vec4 v_color;
varying vec3 v_normal;

void main() {
    gl_Position = u_worldViewProjection * u_model * vec4(a_position, 1.0);
    v_normal = (u_worldInverseTranspose * vec4(a_normal, 0.0)).xyz;
    v_color = vec4(1, 0, 0, 1);
}



