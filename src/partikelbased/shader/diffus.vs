precision highp float;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_model;

attribute vec3 a_position;
attribute vec3 a_normal;

varying vec4 v_position;
varying vec3 v_normal;
varying vec4 v_color;

void main() {
    v_position = u_model * vec4(a_position, 1.0);
    v_normal = a_normal; // wenn model in nur eine seite skaliert muss normalenMatrix zum reparieren her
    v_color = vec4(1, 0, 0, 1);

    gl_Position = u_projection * u_view * v_position;
}



