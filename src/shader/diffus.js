export const diffus_vs = 
`
    precision highp float;

    uniform mat4 u_projection;
    uniform mat4 u_view;
    uniform mat4 u_model;
    uniform vec4 u_color;

    attribute vec3 a_position;
    attribute vec3 a_normal;

    varying vec4 v_position;
    varying vec3 v_normal;
    varying vec4 v_color;

    void main() {
        v_position = u_model * vec4(a_position, 1.0);
        v_normal = a_normal; // wenn model in nur eine seite skaliert muss normalenMatrix zum reparieren her
        v_color = u_color;

        gl_Position = u_projection * u_view * v_position;
    }
`

export const diffus_fs = 
`
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
`