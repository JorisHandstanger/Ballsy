/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	eval("__webpack_require__(1);\nmodule.exports = __webpack_require__(2);\n\n\n/*****************\n ** WEBPACK FOOTER\n ** multi main\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///multi_main?");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }\n\nvar _helpersUtil = __webpack_require__(4);\n\nvar _helpersController = __webpack_require__(5);\n\nvar _modulesOrb = __webpack_require__(6);\n\nvar _modulesOrb2 = _interopRequireDefault(_modulesOrb);\n\nvar _modulesEnvironment = __webpack_require__(7);\n\nvar _modulesEnvironment2 = _interopRequireDefault(_modulesEnvironment);\n\n__webpack_require__(8);\n\nvar socket = undefined;\nvar self = undefined;\n\nvar camera = undefined,\n    scene = undefined,\n    renderer = undefined,\n    composer = undefined;\n\nvar controls = undefined,\n    stats = undefined,\n    element = undefined;\n\nvar orbs = [];\nvar objects = [];\n\nvar environment = undefined;\n\nvar context = new AudioContext();\nvar sourceNode = undefined,\n    javascriptNode = undefined,\n    analyser = undefined;\n\nvar raycaster = undefined;\n\nvar blocker = document.getElementById('blocker');\nvar crosshairs = document.getElementById('crosshairs');\nvar instructions = document.getElementById('instructions');\n\nvar controlsEnabled = false;\nvar moveForward = false;\nvar moveBackward = false;\nvar moveLeft = false;\nvar moveRight = false;\n\nvar prevTime = performance.now();\nvar velocity = new THREE.Vector3();\n\nvar havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;\n\nvar pointerlockchange = function pointerlockchange() {\n  if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {\n    controlsEnabled = true;\n    controls.enabled = true;\n\n    blocker.style.display = 'none';\n    crosshairs.style.display = 'block';\n  } else {\n    controls.enabled = false;\n    blocker.style.display = '-webkit-box';\n    blocker.style.display = '-moz-box';\n    blocker.style.display = 'box';\n    instructions.style.display = '';\n    crosshairs.style.display = 'none';\n  }\n};\n\nvar pointerlockerror = function pointerlockerror() {\n  instructions.style.display = '';\n  crosshairs.style.display = 'block';\n};\n\nif (havePointerLock) {\n  element = document.body;\n\n  // Performance monitor voor development\n  stats = new Stats();\n  stats.setMode(0); // 0: fps, 1: ms, 2: mb\n\n  stats.domElement.style.position = 'absolute';\n  stats.domElement.style.left = '0px';\n  stats.domElement.style.top = '0px';\n\n  document.body.appendChild(stats.domElement);\n\n  // Hook pointer lock state change events\n  document.addEventListener('pointerlockchange', pointerlockchange, false);\n  document.addEventListener('mozpointerlockchange', pointerlockchange, false);\n  document.addEventListener('webkitpointerlockchange', pointerlockchange, false);\n\n  document.addEventListener('pointerlockerror', pointerlockerror, false);\n  document.addEventListener('mozpointerlockerror', pointerlockerror, false);\n  document.addEventListener('webkitpointerlockerror', pointerlockerror, false);\n\n  instructions.addEventListener('click', function () {\n    instructions.style.display = 'none';\n\n    // Ask the browser to lock the pointer\n    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;\n\n    if (/Firefox/i.test(navigator.userAgent)) {\n      (function () {\n        var fullscreenchange = function fullscreenchange() {\n          if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {\n            document.removeEventListener('fullscreenchange', fullscreenchange);\n            document.removeEventListener('mozfullscreenchange', fullscreenchange);\n            element.requestPointerLock();\n          }\n        };\n\n        document.addEventListener('fullscreenchange', fullscreenchange, false);\n        document.addEventListener('mozfullscreenchange', fullscreenchange, false);\n\n        element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;\n        element.requestFullscreen();\n      })();\n    } else {\n      element.requestPointerLock();\n    }\n  }, false);\n} else {\n  instructions.innerHTML = 'Your browser doesn\\'t seem to support Pointer Lock API';\n}\n\nvar init = function init() {\n  socket = io(window.location.host);\n\n  socket.on('init', function (clients) {\n    console.log(clients);\n    self = (0, _helpersUtil.last)(clients);\n    var enemies = (0, _helpersUtil.without)(clients, self);\n    console.log(enemies);\n\n    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);\n\n    scene = new THREE.Scene();\n    scene.fog = new THREE.Fog(0x000000, 0, 750);\n\n    var light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.89);\n    light.position.set(0.5, 20, 0.75);\n    scene.add(light);\n\n    controls = new THREE.PointerLockControls(camera);\n    scene.add(controls.getObject());\n\n    /*for (let i = 0; i <= 20; i++) {\n      let orb = new Orb(\n        i,\n        false,\n        getRandomPoint(),\n        getRandomColor()\n      );\n      orbs.push(orb);\n    }*/\n\n    enemies.forEach(function (e) {\n      var orb = new _modulesOrb2['default'](e.id, true, (0, _helpersUtil.getRandomPoint)(), (0, _helpersUtil.getRandomColor)());\n      orbs.push(orb);\n    });\n\n    socket.on('join', function (client) {\n      var orb = new _modulesOrb2['default'](client.id, true, (0, _helpersUtil.getRandomPoint)(), (0, _helpersUtil.getRandomColor)());\n      console.log(orb);\n      orbs.push(orb);\n      scene.add(orb.render());\n    });\n\n    document.addEventListener('keydown', onKeyDown, false);\n    document.addEventListener('keyup', onKeyUp, false);\n\n    raycaster = new THREE.Raycaster();\n\n    environment = new _modulesEnvironment2['default']();\n\n    scene.add(environment.render());\n\n    // AUDIO\n\n    if (!window.AudioContext) {\n      if (!window.webkitAudioContext) {\n        instructions.innerHTML = 'Your browser doesn\\'t seem to support the Audio API';\n      }\n      window.AudioContext = window.webkitAudioContext;\n    }\n\n    var loadSound = function loadSound(url) {\n      var request = new XMLHttpRequest();\n      request.open('GET', url, true);\n      request.responseType = 'arraybuffer';\n\n      // When loaded decode the data\n      request.onload = function () {\n\n        // decode the data\n        context.decodeAudioData(request.response, function (buffer) {\n          // when the audio is decoded play the sound\n          playSound(buffer);\n        }, onError);\n      };\n\n      request.send();\n    };\n\n    var playSound = function playSound(buffer) {\n      sourceNode.buffer = buffer;\n      sourceNode.start(0);\n    };\n\n    // log if an error occurs\n    var onError = function onError(e) {\n      console.log(e);\n    };\n\n    var setupAudioNodes = function setupAudioNodes() {\n\n      // setup a javascript node\n      javascriptNode = context.createScriptProcessor(2048, 1, 1);\n      // connect to destination, else it isn't called\n      javascriptNode.connect(context.destination);\n\n      // setup a analyzer\n      analyser = context.createAnalyser();\n      analyser.smoothingTimeConstant = 0.5;\n      analyser.fftSize = 32;\n\n      // create a buffer source node\n      sourceNode = context.createBufferSource();\n      sourceNode.connect(analyser);\n      analyser.connect(javascriptNode);\n\n      sourceNode.connect(context.destination);\n    };\n\n    setupAudioNodes();\n    loadSound('./assets/monody.mp3');\n\n    javascriptNode.onaudioprocess = function () {\n\n      // get the average for the first channel\n      var array = new Uint8Array(analyser.frequencyBinCount);\n      analyser.getByteFrequencyData(array);\n\n      environment.update(array);\n    };\n\n    // Renderen van de orbs\n    orbs.forEach(function (e) {\n      scene.add(e.render());\n      objects.push(e.obj.shape);\n    });\n\n    socket.on('updatePos', function (data) {\n      orbs.forEach(function (e) {\n        if (e.id === data.id) {\n          console.log(data);\n          e.position.x = data.x;\n          e.position.y = data.y;\n          e.position.z = data.z;\n\n          e.update();\n        }\n      });\n    });\n\n    //\n    renderer = new THREE.WebGLRenderer();\n    renderer.setClearColor(0x000000);\n    renderer.setPixelRatio(window.devicePixelRatio);\n    renderer.setSize(window.innerWidth, window.innerHeight);\n    document.body.appendChild(renderer.domElement);\n\n    //\n    renderer.autoClear = false;\n\n    composer = new THREE.EffectComposer(renderer);\n\n    var renderPass = new THREE.RenderPass(scene, camera);\n    composer.addPass(renderPass);\n\n    // Bloom pass voor glow\n\n    var bloomPass = new THREE.BloomPass(2, 20, 3, 256); // (strength, kernelSize, sigma, resolution)\n    composer.addPass(bloomPass);\n\n    var glitchPass = new THREE.GlitchPass();\n    glitchPass.renderToScreen = true;\n    glitchPass.goWild = false;\n    composer.addPass(glitchPass);\n\n    window.addEventListener('resize', onWindowResize, false);\n    window.addEventListener('gamepadconnected', gamepadControls);\n\n    animate();\n  });\n};\n\nvar animate = function animate() {\n  requestAnimationFrame(animate);\n\n  stats.begin(); // Begin van te monitoren code\n\n  if (controlsEnabled) {\n    var time = performance.now();\n    var delta = (time - prevTime) / 1000;\n\n    velocity.x -= velocity.x * 5.0 * delta;\n    velocity.z -= velocity.z * 5.0 * delta;\n    velocity.y -= velocity.y * 5.0 * delta;\n\n    if (moveForward) velocity.z -= 500.0 * delta - 500.0 * delta / (90 * Math.PI / 180) * Math.abs(controls.getPitchObject().rotation.x);\n    if (moveBackward) velocity.z += 500.0 * delta - 500.0 * delta / (90 * Math.PI / 180) * Math.abs(controls.getPitchObject().rotation.x);\n\n    if (moveLeft) velocity.x -= 500.0 * delta;\n    if (moveRight) velocity.x += 500.0 * delta;\n\n    if (moveForward) velocity.y += 500.0 * delta / (90 * Math.PI / 180) * controls.getPitchObject().rotation.x;\n    if (moveBackward) velocity.y -= 500.0 * delta / (90 * Math.PI / 180) * controls.getPitchObject().rotation.x;\n\n    controls.getObject().translateX(velocity.x * delta);\n    controls.getObject().translateY(velocity.y * delta);\n    controls.getObject().translateZ(velocity.z * delta);\n\n    if (Math.abs(velocity.y) >= 0.01 || Math.abs(velocity.x) >= 0.01 || Math.abs(velocity.z) >= 0.01) {\n      var position = {\n        id: self.id,\n        x: controls.getObject().position.x,\n        y: controls.getObject().position.y,\n        z: controls.getObject().position.z\n      };\n\n      socket.emit('position', position);\n    }\n\n    prevTime = time;\n  }\n\n  renderer.clear();\n  composer.render();\n\n  orbs.forEach(function (e) {\n    e.update();\n  });\n\n  raycaster.setFromCamera({ x: 0, y: 0 }, camera);\n\n  var intersects = raycaster.intersectObjects(objects, true);\n\n  for (var i = 0; i < intersects.length; i++) {\n    if (orbs[intersects[i].object.name] !== undefined) {\n      var orb = orbs[intersects[i].object.name];\n\n      if (orb.health > 0 && orb.health !== undefined) {\n        orb.health -= 2;\n      }\n    }\n  }\n\n  stats.end();\n};\n\nvar gamepadControls = function gamepadControls() {\n  var gamepad = navigator.getGamepads()[0];\n  var joyX = (0, _helpersController.deadzone)(gamepad.axes[0], 0.25);\n  var joyY = (0, _helpersController.deadzone)(gamepad.axes[1], 0.25);\n\n  if (joyX < 0) {\n    moveLeft = true;\n  } else if (joyX > 0) {\n    moveRight = true;\n  } else if (Math.abs(joyX) === 0) {\n    moveLeft = false;\n    moveRight = false;\n  }\n\n  if (joyY < 0) {\n    moveForward = true;\n  } else if (joyY > 0) {\n    moveBackward = true;\n  } else if (Math.abs(joyX) === 0) {\n    moveForward = false;\n    moveBackward = false;\n  }\n  window.requestAnimationFrame(gamepadControls);\n};\n\nvar onKeyDown = function onKeyDown(event) {\n  switch (event.keyCode) {\n    case 38: // up\n    case 90:\n      // z\n      moveForward = true;\n      break;\n    case 37: // left\n    case 81:\n      // q\n      moveLeft = true;\n      break;\n    case 40: // down\n    case 83:\n      // s\n      moveBackward = true;\n      break;\n    case 39: // right\n    case 68:\n      // d\n      moveRight = true;\n      break;\n  }\n};\n\nvar onKeyUp = function onKeyUp(event) {\n  switch (event.keyCode) {\n    case 38: // up\n    case 90:\n      // z\n      moveForward = false;\n      break;\n    case 37: // left\n    case 81:\n      // q\n      moveLeft = false;\n      break;\n    case 40: // down\n    case 83:\n      // s\n      moveBackward = false;\n      break;\n    case 39: // right\n    case 68:\n      // d\n      moveRight = false;\n      break;\n  }\n};\n\nvar onWindowResize = function onWindowResize() {\n  camera.aspect = window.innerWidth / window.innerHeight;\n  camera.updateProjectionMatrix();\n  renderer.setSize(window.innerWidth, window.innerHeight);\n};\n\ninit();\n\n/*****************\n ** WEBPACK FOOTER\n ** ./_js/script.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./_js/script.js?");

/***/ },
/* 2 */
/***/ function(module, exports) {

	eval("// removed by extract-text-webpack-plugin\n\n/*****************\n ** WEBPACK FOOTER\n ** ./_scss/style.scss\n ** module id = 2\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./_scss/style.scss?");

/***/ },
/* 3 */,
/* 4 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, '__esModule', {\n  value: true\n});\nvar getRandomPoint = function getRandomPoint() {\n  return {\n    x: randomBetween(-300, 300),\n    y: randomBetween(10, 60),\n    z: randomBetween(-300, 300)\n  };\n};\n\nexports.getRandomPoint = getRandomPoint;\nvar last = function last(arr) {\n  return arr.slice(-1)[0];\n};\n\nexports.last = last;\nvar without = function without(arr) {\n  for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {\n    values[_key - 1] = arguments[_key];\n  }\n\n  return arr.filter(function (el) {\n    return !values.some(function (exclude) {\n      return el === exclude;\n    });\n  });\n};\n\nexports.without = without;\nvar randomBetween = function randomBetween(min, max) {\n  var rand = min + Math.random() * (max - min);\n  if (rand) rand = Math.round(rand);\n\n  return rand;\n};\n\nexports.randomBetween = randomBetween;\nvar getRandomColor = function getRandomColor() {\n  var letters = '0123456789ABCDEF'.split('');\n  var color = '0x';\n\n  for (var i = 0; i < 6; i++) {\n    color += letters[Math.floor(Math.random() * 16)];\n  }\n\n  return color;\n};\n\nexports.getRandomColor = getRandomColor;\nvar getAverageValue = function getAverageValue(array, min, max) {\n  var values = 0;\n  var average;\n\n  var length = max - min;\n\n  for (var i = min; i < max; i++) {\n    values += array[i];\n  }\n\n  average = values / length;\n  return average;\n};\n\nexports.getAverageValue = getAverageValue;\nvar lightenColor = function lightenColor(color, percent) {\n  var num = parseInt(color, 16),\n      amt = Math.round(2.55 * percent),\n      R = (num >> 16) + amt,\n      B = (num >> 8 & 0x00FF) + amt,\n      G = (num & 0x0000FF) + amt;\n\n  return (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);\n};\nexports.lightenColor = lightenColor;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./_js/helpers/util.js\n ** module id = 4\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./_js/helpers/util.js?");

/***/ },
/* 5 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, '__esModule', {\n  value: true\n});\nvar deadzone = function deadzone(number, treshold) {\n  var percentage = (Math.abs(number) - treshold) / (1 - treshold);\n  if (percentage < 0) percentage = 0;\n  return percentage * (number > 0 ? 1 : -1);\n};\nexports.deadzone = deadzone;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./_js/helpers/controller.js\n ** module id = 5\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./_js/helpers/controller.js?");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, '__esModule', {\n  value: true\n});\n\nvar _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }\n\nvar _helpersUtil = __webpack_require__(4);\n\nvar Orb = (function () {\n  function Orb(id, player, position, color) {\n    _classCallCheck(this, Orb);\n\n    this.id = id;\n    this.player = player;\n    this.color = color;\n    this.position = position;\n\n    this.health = 100;\n\n    this.obj = {};\n  }\n\n  _createClass(Orb, [{\n    key: 'update',\n    value: function update() {\n\n      var time = performance.now();\n      var sineScale = 1 - Math.sin(time / 800 - 1) / 8;\n\n      this.obj.shape.children[1].scale.set(sineScale, sineScale, sineScale);\n\n      this.obj.shape.children[1].material.opacity = this.health / 170;\n\n      this.obj.shape.position.set(this.position);\n    }\n  }, {\n    key: 'render',\n    value: function render() {\n      var _position = this.position;\n      var x = _position.x;\n      var y = _position.y;\n      var z = _position.z;\n\n      var group = new THREE.Object3D();\n\n      var outerBall = undefined;\n      var light1 = undefined;\n\n      // Licht bal\n      var sphere = new THREE.SphereGeometry(3, 30, 30);\n\n      light1 = new THREE.PointLight(parseInt(this.color, 16), 3, 30);\n      light1.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({\n        color: parseInt((0, _helpersUtil.lightenColor)(this.color, 50), 16)\n      })));\n      light1.position.set(x, y, z);\n      light1.name = this.id;\n\n      group.add(light1);\n\n      // Buitenste mesh\n      var geometry = new THREE.SphereGeometry(8, 30, 30);\n\n      var material = new THREE.MeshLambertMaterial({\n        color: parseInt(this.color),\n        transparent: true,\n        opacity: 0.3\n      });\n\n      outerBall = new THREE.Mesh(geometry.clone(), material.clone());\n      outerBall.position.set(x, y, z);\n\n      outerBall.name = this.id;\n\n      group.add(outerBall);\n\n      this.obj.shape = group;\n\n      return this.obj.shape;\n    }\n  }]);\n\n  return Orb;\n})();\n\nexports['default'] = Orb;\nmodule.exports = exports['default'];\n\n/*****************\n ** WEBPACK FOOTER\n ** ./_js/modules/Orb.js\n ** module id = 6\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./_js/modules/Orb.js?");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, '__esModule', {\n  value: true\n});\n\nvar _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }\n\nvar _helpersUtil = __webpack_require__(4);\n\nvar Environment = (function () {\n  function Environment() {\n    _classCallCheck(this, Environment);\n\n    this.grid = new THREE.GridHelper(1000, 270);\n    this.grid2 = new THREE.GridHelper(1000, 90);\n    this.grid3 = new THREE.GridHelper(1000, 30);\n\n    this.tower = {};\n    this.ring = {};\n\n    this.obj = {};\n  }\n\n  _createClass(Environment, [{\n    key: 'update',\n    value: function update(array) {\n      var lowtones = (0, _helpersUtil.getAverageValue)(array, 1, 5) / 255 * 100;\n      var midtones = (0, _helpersUtil.getAverageValue)(array, 6, 10) / 255 * 100;\n      var hightones = (0, _helpersUtil.getAverageValue)(array, 11, 15) / 255 * 100;\n\n      var gridcolor3 = 0x02070d;\n      var gridcolor2 = 0x250935;\n      var gridcolor = 0x350926;\n\n      var newColor = new THREE.Color(parseInt((0, _helpersUtil.lightenColor)(gridcolor, lowtones), 16));\n      var newColor2 = new THREE.Color(parseInt((0, _helpersUtil.lightenColor)(gridcolor2, midtones / 2), 16));\n      var newColor3 = new THREE.Color(parseInt((0, _helpersUtil.lightenColor)(gridcolor3, hightones), 16));\n\n      this.grid.setColors(newColor, newColor);\n      this.grid2.setColors(newColor2, newColor2);\n      this.grid3.setColors(newColor3, newColor3);\n\n      if (this.tower.type === \"Object3D\") {\n        this.tower.children[0].material.color = newColor3;\n\n        this.tower.scale.set(0.3, 0.3 + hightones / 300, 0.3);\n      }\n\n      if (this.ring.type === \"Object3D\") {\n        this.ring.children[0].material.color = newColor2;\n\n        this.ring.scale.set(0.3, 0.3 + midtones / 300, 0.3);\n      }\n    }\n  }, {\n    key: 'render',\n    value: function render() {\n      var _this = this;\n\n      var group = new THREE.Object3D();\n\n      // floor\n      var geometry = new THREE.PlaneGeometry(2000, 2000);\n      geometry.rotateX(-Math.PI / 2);\n\n      var material = new THREE.MeshPhongMaterial({\n        color: 0x000000,\n        specular: 0x0F0F0F,\n        shininess: 60\n      });\n\n      var mesh = new THREE.Mesh(geometry, material);\n      group.add(mesh);\n\n      this.grid.setColors(new THREE.Color(0x333333), new THREE.Color(0x333333));\n      this.grid.position.y = 1;\n      this.grid.material.opacity = 0.6;\n      group.add(this.grid);\n\n      this.grid2.setColors(new THREE.Color(0x333333), new THREE.Color(0x333333));\n      this.grid2.position.y = 2;\n      this.grid2.material.opacity = 0.6;\n      group.add(this.grid2);\n\n      this.grid3.setColors(new THREE.Color(0x333333), new THREE.Color(0x333333));\n      this.grid3.position.y = 3;\n      this.grid3.material.opacity = 0.6;\n\n      group.add(this.grid3);\n\n      // center piece\n\n      var loader = new THREE.OBJLoader();\n\n      loader.load(\n      // resource URL\n      './assets/abstract.obj',\n      // Function when resource is loaded\n      function (object) {\n        _this.tower = object;\n\n        var towerMaterial = new THREE.MeshLambertMaterial({\n          color: parseInt(0x02070d),\n          transparent: true,\n          opacity: 0.6\n        });\n\n        _this.tower.children[0].material = towerMaterial;\n\n        group.add(_this.tower);\n        _this.tower.position.set(-12, 0, -12);\n        _this.tower.rotation.set(0, 0, 0);\n        _this.tower.scale.set(0.3, 0.3, 0.3);\n      });\n\n      var loader2 = new THREE.OBJLoader();\n\n      loader2.load(\n      // resource URL\n      './assets/abstract2.obj',\n      // Function when resource is loaded\n      function (object) {\n        _this.ring = object;\n\n        var ringMaterial = new THREE.MeshLambertMaterial({\n          color: parseInt(0x02070d),\n          transparent: true,\n          opacity: 0.2\n        });\n\n        _this.ring.children[0].material = ringMaterial;\n\n        group.add(_this.ring);\n        _this.ring.position.set(-12, 0, -12);\n        _this.ring.rotation.set(0, 0, 0);\n        _this.ring.scale.set(0.3, 0.3, 0.3);\n      });\n\n      this.obj.shape = group;\n\n      return this.obj.shape;\n    }\n  }]);\n\n  return Environment;\n})();\n\nexports['default'] = Environment;\nmodule.exports = exports['default'];\n\n/*****************\n ** WEBPACK FOOTER\n ** ./_js/modules/environment.js\n ** module id = 7\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./_js/modules/environment.js?");

/***/ },
/* 8 */
/***/ function(module, exports) {

	eval("'use strict';\n/**\n * @author mrdoob / http://mrdoob.com/\n */\n\nTHREE.PointerLockControls = function (camera) {\n\n  var scope = this;\n\n  camera.rotation.set(0, 0, 0);\n\n  var pitchObject = new THREE.Object3D();\n  pitchObject.add(camera);\n\n  var yawObject = new THREE.Object3D();\n  yawObject.position.y = 10;\n  yawObject.add(pitchObject);\n\n  var PI_2 = Math.PI / 2;\n\n  var onMouseMove = function onMouseMove(event) {\n\n    if (scope.enabled === false) return;\n\n    var movementX = event.movementX || event.mozMovementX || 0;\n    var movementY = event.movementY || event.mozMovementY || 0;\n\n    yawObject.rotation.y -= movementX * 0.002;\n    pitchObject.rotation.x -= movementY * 0.002;\n\n    pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));\n  };\n\n  this.dispose = function () {\n\n    document.removeEventListener('mousemove', onMouseMove, false);\n  };\n\n  document.addEventListener('mousemove', onMouseMove, false);\n\n  this.enabled = false;\n\n  this.getObject = function () {\n\n    return yawObject;\n  };\n\n  this.getPitchObject = function () {\n\n    return pitchObject;\n  };\n\n  this.getDirection = (function () {\n\n    // assumes the camera itself is not rotated\n\n    var direction = new THREE.Vector3(0, 0, -1);\n    var rotation = new THREE.Euler(0, 0, 0, 'YXZ');\n\n    return function (v) {\n\n      rotation.set(pitchObject.rotation.x, yawObject.rotation.y, 0);\n\n      v.copy(direction).applyEuler(rotation);\n\n      return v;\n    };\n  })();\n};\n\n/*****************\n ** WEBPACK FOOTER\n ** ./_js/modules/controls.js\n ** module id = 8\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./_js/modules/controls.js?");

/***/ }
/******/ ]);