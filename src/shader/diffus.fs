precision highp float;

varying vec4 v_color;
varying vec3 v_normal;

vec3 ambientIntensity = vec3(0.3, 0.3, 0.3);
vec3 sunDirection = vec3(2.0, 4.0, -3.0); // TODO change to lightpos
vec3 sunColor = vec3(0.9, 0.9, 0.9);


void main() {
	vec3 normSunDir = normalize(sunDirection);
	vec3 lightIntensity;

	if(gl_FrontFacing) lightIntensity = ambientIntensity + sunColor * max(dot(v_normal, normSunDir), 0.0);
	else lightIntensity = ambientIntensity + sunColor * max(dot(-v_normal, normSunDir), 0.0);
	gl_FragColor = vec4(v_color.rgb * lightIntensity, v_color.a);
}