precision highp float;

float rand(){
    vec2 co = vec2(0.0, 1.0);
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main(void) {
  gl_FragColor = vec4(rand(), rand(), 1.0, 0.6);
}
