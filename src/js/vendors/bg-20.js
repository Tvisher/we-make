const shader = {
	vertex: `uniform float time;
	varying float offset;
	
	void main() {
		vec3 c, z, nz, loc;
		float speed = 0.25;
		float its;
		
		offset = 0.;
		c = position / vec3(120.,120.,120.);
		z = c;
		loc.x = cos(time/4.*speed)/1.9-cos(time/2.*speed)/3.8;
		loc.z = sin(time/4.*speed)/1.9-sin(time/2.*speed)/3.8;
		
		for(int itss = 0; itss < 200; itss+=1) {
			nz.x = z.x*z.x-z.z*z.z+loc.x;
			nz.z = 2.*z.x*z.z+loc.z;
			z = nz;
			offset = float(itss);
			if((z.x*z.x+z.z*z.z) >= 4.)
				break;
		}
		
		gl_PointSize = 1.6;
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, offset, position.z, 1.0);
	}`,
	fragment: `#ifdef GL_ES
	precision lowp float;
	#endif

	varying float offset;
	
	void main( void ) {
		vec4 c1 = vec4(0.,0.,0.,0.);
		vec4 c2 = vec4(0.,.5,1.,1.);
		
		c1 += c2*offset/40.;
		
		gl_FragColor = c1;
	}`
};
var timeStep = 0.002,
    paused = false,
    resolution = 1,
    center = new THREE.Vector3(-20,30,0),
    renderer, camera, scene, uniforms, attributes;
 
$(document).ready(function(){
  
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  	container = document.getElementById( 'bg-20' );
	container.appendChild( renderer.domElement );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( container.offsetWidth, container.offsetHeight );

  
  camera = new THREE.PerspectiveCamera( 45, container.offsetWidth / container.offsetHeight, 1, 2000 );
  camera.position.x = 50;
  camera.position.y = 100;
  camera.position.z = 100;
  camera.lookAt(center);
  onWindowResize();
  scene = new THREE.Scene();
  var fs = shader.fragment;
  var vs = shader.vertex;
  uniforms = {
    time: { type: "f", value: 1.0 }
  };
  
  var pointGeo = new THREE.Geometry();
  
  for(var x = -200; x < 200; x += resolution){
    for(var z = -200; z < 200; z += resolution){
      pointGeo.vertices.push(new THREE.Vector3(x, 0, z));
    }
  }
  
  pointPlane = new THREE.Points(pointGeo,
    new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vs,
    fragmentShader: fs
  }));
  
  scene.add(pointPlane);
  window.addEventListener( 'resize', onWindowResize, false );
  requestAnimationFrame(animate);
                  
});

  
function animate(){
  //controls.update();
  if(!paused)
    uniforms.time.value += timeStep;
  renderer.render(scene,camera);
  requestAnimationFrame(animate);
}
function onWindowResize() {
  camera.aspect = container.offsetWidth / container.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( container.offsetWidth, container.offsetHeight );
}