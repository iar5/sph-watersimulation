precision highp float;

uniform mat4 u_world;
uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;
uniform mat4 u_viewInverse;

attribute vec3 a_position;

void main() {
  gl_Position = u_worldViewProjection * vec4(a_position, 1.0);
  gl_PointSize = 10.0;
}