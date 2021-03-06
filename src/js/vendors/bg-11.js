const shader = {
	vertex: `void main() {
		gl_Position = vec4( position, 1.0 );
	}`,
	fragment: `#ifdef GL_ES
	precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float map(vec2 p, float z) {
	return length(p) - 1.0;
}

vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

float nsin(float value) {
	return sin(value * 6.2831853072) * 0.5 + 0.5;
}

void main( void ) {
	
	float dist;
	vec2 uv, p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	
	
	float d = dot(uv,uv);
	float a = atan(uv.y,uv.x);
	
	
	float l=length(p);
	float z = time; 
	float angle = 6.2831853072 * nsin(z*0.001) * 10.0;
	vec3 color = vec3(0.0);
	
	
	for (int j = 0; j < 3; j++) {
		for ( int i = 0; i < 7; i++){
			
			z+=0.2;
			
			uv.x = map(p,z);
			uv.y = map(p,z);
			
			
			uv.x -= (
				sin(float(i)*0.2)*0.5
			);
			uv.y += (
				cos(float(j)*0.1)*0.5
			);	
			uv = rotate(uv, angle);
			uv += p / l * abs(sin(l * 8.0 - z*0.05));
			color[j] +=  0.2 /  fract(uv.y*uv.x+cos(z*0.05))*1.0 -  0.01 /  abs(uv.y*uv.x)*2.0;                ;
			color[j] += 0.1;
			color[j] = clamp(color[j], 0.1, 1.7);	
		}              
	}
	
	color[0] += 0.;
	color[1] -= 0.5;
	color[2] -= 0.9;
	gl_FragColor = vec4(1.0 -  color, 1.0);
	
}`
};	

var container;
var camera, scene, renderer;
var uniforms;

function init() {
	container = document.getElementById( 'bg-11' );
	camera = new THREE.Camera();
	camera.position.z = 1;
	scene = new THREE.Scene();
	var geometry = new THREE.PlaneBufferGeometry( 2, 2 );
	uniforms = {
		time: { type: "f", value: 1.0 },
		resolution: { type: "v2", value: new THREE.Vector2() }
	};
	var material = new THREE.ShaderMaterial( {
		uniforms: uniforms,
    vertexShader: shader.vertex,
    fragmentShader: shader.fragment
	} );
	var mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	container.appendChild( renderer.domElement );
	onWindowResize();
	window.addEventListener( 'resize', onWindowResize, false );	
}

function onWindowResize( event ) {
	renderer.setSize( container.offsetWidth, container.offsetHeight );
	uniforms.resolution.value.x = renderer.domElement.width;
	uniforms.resolution.value.y = renderer.domElement.height;
}

function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {
	uniforms.time.value += 0.05;
	renderer.render( scene, camera );
}	
init();
animate();