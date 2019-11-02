precision highp float;

varying vec4 v_color;
varying vec3 v_normal;

uniform vec3 ambient;
uniform vec3 sunDirection;
uniform	vec3 sunColor;


void main() {
	vec3 normSunDir = normalize(sunDirection);
	vec3 lightIntensity;

	if(gl_FrontFacing) 
		lightIntensity = ambient + sunColor * max(dot(v_normal, normSunDir), 0.0);
	else 
		lightIntensity = ambient + sunColor * max(dot(-v_normal, normSunDir), 0.0);

	gl_FragColor = vec4(v_color.rgb * lightIntensity, v_color.a);
}