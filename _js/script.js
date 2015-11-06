'use strict';

import thecontrols from './modules/controls';
import Orb from './modules/Orb';

let camera, scene, renderer;
let geometry, material, mesh;
let controls;

let orbs = [];

let raycaster;

let blocker = document.getElementById( 'blocker' );
let instructions = document.getElementById( 'instructions' );

// http://www.html5rocks.com/en/tutorials/pointerlock/intro/
let havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if ( havePointerLock ) {
  let element = document.body;

  let pointerlockchange = function () {

    if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
      controlsEnabled = true;
      controls.enabled = true;

      blocker.style.display = 'none';
    } else {
      controls.enabled = false;

      blocker.style.display = '-webkit-box';
      blocker.style.display = '-moz-box';
      blocker.style.display = 'box';

      instructions.style.display = '';
    }

  };

  const pointerlockerror = () => {
    instructions.style.display = '';
  };

  // Hook pointer lock state change events
  document.addEventListener( 'pointerlockchange', pointerlockchange, false );
  document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
  document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

  document.addEventListener( 'pointerlockerror', pointerlockerror, false );
  document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
  document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

  instructions.addEventListener('click', () => {
    instructions.style.display = 'none';

    // Ask the browser to lock the pointer
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

    if ( /Firefox/i.test( navigator.userAgent ) ) {
      const fullscreenchange = () => {
        if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
          document.removeEventListener( 'fullscreenchange', fullscreenchange );
          document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
          element.requestPointerLock();
        }
      };

      document.addEventListener( 'fullscreenchange', fullscreenchange, false );
      document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

      element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
      element.requestFullscreen();
    } else {
      element.requestPointerLock();
    }
  }, false);

  // instructions.addEventListener('click', function(){
  //
  //   instructions.style.display = 'none';
  //
  //   // Ask the browser to lock the pointer
  //   element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
  //
  //   if ( /Firefox/i.test( navigator.userAgent ) ) {
  //
  //     var fullscreenchange = function () {
  //
  //       if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
  //
  //         document.removeEventListener( 'fullscreenchange', fullscreenchange );
  //         document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
  //
  //         element.requestPointerLock();
  //       }
  //
  //     };
  //
  //     document.addEventListener( 'fullscreenchange', fullscreenchange, false );
  //     document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
  //
  //     element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
  //
  //     element.requestFullscreen();
  //
  //   } else {
  //
  //     element.requestPointerLock();
  //
  //   }
  //
  // }, false);

} else {
  instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
}

let controlsEnabled = false;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

let prevTime = performance.now();
let velocity = new THREE.Vector3();

const init = () => {
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0x000000, 0, 750 );

  let light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.89 );
  light.position.set( 0.5, 20, 0.75 );
  scene.add( light );

  controls = new THREE.PointerLockControls( camera );
  scene.add( controls.getObject() );

  for (let i = 0; i <= 10; i++) {
    let orb = new Orb(
      getRandomPoint(),
      getRandomColor()
    );
    orbs.push(orb);
  }

  const onKeyDown = event => {
    switch ( event.keyCode ) {

    case 38: // up
    case 90: // z
      moveForward = true;
      break;

    case 37: // left
    case 81: // q
      moveLeft = true;
      break;

    case 40: // down
    case 83: // s
      moveBackward = true;
      break;

    case 39: // right
    case 68: // d
      moveRight = true;
      break;

    }
  };

  const onKeyUp = event => {
    switch( event.keyCode ) {

    case 38: // up
    case 90: // z
      moveForward = false;
      break;

    case 37: // left
    case 81: // q
      moveLeft = false;
      break;

    case 40: // down
    case 83: // s
      moveBackward = false;
      break;

    case 39: // right
    case 68: // d
      moveRight = false;
      break;

    }
  };

  document.addEventListener( 'keydown', onKeyDown, false );
  document.addEventListener( 'keyup', onKeyUp, false );

  raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, -1, 0 ), 0, 10 );

  // floor
  geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
  geometry.rotateX(-Math.PI / 2 );

  //vorm van vloer
  for (let i = 0, l = geometry.vertices.length; i < l; i++) {
    let vertex = geometry.vertices[ i ];
    vertex.x += Math.random() * 20 - 10;
    vertex.y += Math.random() * 10;
    vertex.z += Math.random() * 20 - 10;
  }

  material = new THREE.MeshPhongMaterial( { color: 0x444444, specular: 0x444444, shininess: 30 } );

  mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  orbs.forEach(e => {
    scene.add(e.render(camera));
  });

  //
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor( 0x000000 );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  //
  window.addEventListener( 'resize', onWindowResize, false );
};

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
};

const update = () => {
  orbs.forEach(e => {
    e.update(controls);
  });
};

const animate = () => {
  requestAnimationFrame( animate );

  if ( controlsEnabled ) {
    raycaster.ray.origin.copy( controls.getObject().position );
    raycaster.ray.origin.y -= 10;

    let time = performance.now();
    let delta = ( time - prevTime ) / 1000;

    velocity.x -= velocity.x * 5.0 * delta;
    velocity.z -= velocity.z * 5.0 * delta;
    velocity.y -= velocity.y * 5.0 * delta;

    if ( moveForward ) velocity.z -= (500.0 * delta)-(((500.0 * delta)/(90 * Math.PI / 180))*Math.abs(controls.getPitchObject().rotation.x));
    if ( moveBackward ) velocity.z += (500.0 * delta)-(((500.0 * delta)/(90 * Math.PI / 180))*Math.abs(controls.getPitchObject().rotation.x));

    if ( moveLeft ) velocity.x -= 500.0 * delta;
    if ( moveRight ) velocity.x += 500.0 * delta;

    if ( moveForward ) velocity.y += ((500.0 * delta)/(90 * Math.PI / 180))*controls.getPitchObject().rotation.x;
    if ( moveBackward ) velocity.y -= ((500.0 * delta)/(90 * Math.PI / 180))*controls.getPitchObject().rotation.x;


    controls.getObject().translateX( velocity.x * delta );
    controls.getObject().translateY( velocity.y * delta );
    controls.getObject().translateZ( velocity.z * delta );

    prevTime = time;
  }

  renderer.render( scene, camera );
  update();
};

const getRandomPoint = () => {
  return {
    x: randomBetween(-300, 300),
    y: randomBetween(10, 60),
    z: randomBetween(-300, 300)
  };
};

const randomBetween = (min, max) => {
  let rand = min + Math.random() * (max-min);
  if(rand) rand = Math.round(rand);

  return rand;
};

const getRandomColor = () => {
  let letters = '0123456789ABCDEF'.split('');
  let color = '0x';
  for (let i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

init();
animate();
