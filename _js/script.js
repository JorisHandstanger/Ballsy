'use strict';

require('./modules/controls');
import {getRandomPoint, getRandomColor} from './helpers/util';
import {deadzone} from './helpers/controller';
import Orb from './modules/Orb';

let camera, scene, renderer, composer;

let geometry, material, mesh;
let controls, stats, element;

let orbs = [];
let objects = [];

let raycaster;

let blocker = document.getElementById( 'blocker' );
let crosshairs = document.getElementById( 'crosshairs' );
let instructions = document.getElementById( 'instructions' );

let controlsEnabled = false;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

let prevTime = performance.now();
let velocity = new THREE.Vector3();

//http://www.html5rocks.com/en/tutorials/pointerlock/intro/

let havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

const pointerlockchange = () => {
  if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
    controlsEnabled = true;
    controls.enabled = true;

    blocker.style.display = 'none';
    crosshairs.style.display = 'block';
  } else {
    controls.enabled = false;
    blocker.style.display = '-webkit-box';
    blocker.style.display = '-moz-box';
    blocker.style.display = 'box';
    instructions.style.display = '';
    crosshairs.style.display = 'none';
  }
};

const pointerlockerror = () => {
  instructions.style.display = '';
  crosshairs.style.display = 'block';
};

if ( havePointerLock ) {
  element = document.body;

  // Performance monitor voor development
  stats = new Stats();
  stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  document.body.appendChild( stats.domElement );

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

} else {
  instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
}

const gamepadControls = () => {
  let gamepad = navigator.getGamepads()[0];
  let joyX = deadzone(gamepad.axes[0], 0.25);
  let joyY = deadzone(gamepad.axes[1], 0.25);

  if (joyX < 0) {
    moveLeft = true;
  } else if (joyX > 0) {
    moveRight = true;
  } else if (Math.abs(joyX) === 0) {
    moveLeft = false;
    moveRight = false;
  }

  if (joyY < 0) {
    moveForward = true;
  } else if (joyY > 0) {
    moveBackward = true;
  } else if (Math.abs(joyX) === 0) {
    moveForward = false;
    moveBackward = false;
  }
  window.requestAnimationFrame(gamepadControls);
};

const init = () => {
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0x000000, 0, 750 );

  let light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.89 );
  light.position.set( 0.5, 20, 0.75 );
  scene.add( light );

  controls = new THREE.PointerLockControls( camera );
  scene.add( controls.getObject() );

  for (let i = 0; i <= 50; i++) {
    let orb = new Orb(
      i,
      getRandomPoint(),
      getRandomColor()
    );
    orbs.push(orb);
  }

  document.addEventListener( 'keydown', onKeyDown, false );
  document.addEventListener( 'keyup', onKeyUp, false );

  raycaster = new THREE.Raycaster();

  // floor
  geometry = new THREE.PlaneGeometry( 2000, 2000 );
  geometry.rotateX(-Math.PI / 2 );

  material = new THREE.MeshPhongMaterial( {
    color: 0x000000,
    specular: 0x0F0F0F,
    shininess: 60
  });

  mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  let grid = new THREE.GridHelper(1000, 30);
  grid.setColors( new THREE.Color(0x333333), new THREE.Color(0x333333) );
  grid.position.y = 1;
  scene.add(grid);

  // Renderen van de orbs
  orbs.forEach(e => {
    scene.add(e.render());
    objects.push(e.obj.shape);
  });

  //
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x000000);
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  //
  renderer.autoClear = false;

  composer = new THREE.EffectComposer(renderer);

  let renderPass = new THREE.RenderPass(scene, camera);
  composer.addPass(renderPass);

  // Bloom pass voor glow

  let bloomPass = new THREE.BloomPass(2, 20, 3, 256); // (strength, kernelSize, sigma, resolution)
  composer.addPass(bloomPass);
  let effectCopy = new THREE.ShaderPass(THREE.CopyShader);
  effectCopy.renderToScreen = true;
  composer.addPass(effectCopy);

  window.addEventListener( 'resize', onWindowResize, false );
  window.addEventListener('gamepadconnected', gamepadControls);
};

const animate = () => {

  requestAnimationFrame( animate );

  stats.begin(); // Begin van te monitoren code

  if ( controlsEnabled ) {

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

  renderer.clear();
  composer.render();

  orbs.forEach(e => {
    e.update();
  });

  raycaster.setFromCamera( {x: 0, y: 0}, camera );

  let intersects = raycaster.intersectObjects( objects, true );

  for ( var i = 0; i < intersects.length; i++ ) {

    if(orbs[intersects[i].object.name] !== undefined){
      let orb = orbs[intersects[i].object.name];

      if(orb.health > 0 && orb.health !== undefined){
        orb.health -= 2;
      }
    }
  }

  stats.end();
};

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

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
};

init();
animate();
