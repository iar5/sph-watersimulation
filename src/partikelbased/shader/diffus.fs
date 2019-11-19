precision highp float;

varying vec4 v_position;
varying vec3 v_normal;
varying vec4 v_color;

uniform vec3 ambient;
uniform vec3 sunPosition;
uniform	vec3 sunColor;


void main() {
	vec3 normSunDir = normalize(sunPosition - v_position.xyz); // point light
	//vec3 normSunDir = normalize(sunPosition); // directional light

	vec3 lightIntensity;

	if(gl_FrontFacing) 
		lightIntensity = ambient + sunColor * max(dot(v_normal, normSunDir), 0.0);
	else 
		lightIntensity = ambient + sunColor * max(dot(-v_normal, normSunDir), 0.0);

	gl_FragColor = vec4(v_color.rgb * lightIntensity, v_color.a);
}