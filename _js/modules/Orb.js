'use strict';

export default class Orb {

  constructor(position, color){

    this.color = color;
    this.position = position;

    this.obj = {};

  }

  update(controls){
    this.obj.shape.children[1].material.uniforms.viewVector.value = new THREE.Vector3().subVectors(controls.getObject().position, this.obj.shape.children[2].position );
    this.obj.shape.children[2].material.uniforms.viewVector.value = new THREE.Vector3().subVectors(controls.getObject().position, this.obj.shape.children[2].position );

    let time = performance.now();
    let sineScale = 1 - (Math.sin(time/800 - 1)/8);

    this.obj.shape.children[0].intensity = sineScale*2;
    this.obj.shape.children[1].scale.set(sineScale, sineScale, sineScale);
    this.obj.shape.children[2].scale.set(sineScale, sineScale, sineScale);
  }

  render(camera){

    let {x, y, z} = this.position;

    let group = new THREE.Object3D();//create an empty container

    let outerBall;
    let middleBall;
    let light1;

    // Licht bal
    let sphere = new THREE.SphereGeometry( 3, 30, 30 );

    light1 = new THREE.PointLight( parseInt(this.color, 16), 3, 30 );
    light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: parseInt(this.LightenColor(this.color, 50), 16)})));

    light1.position.x = x;
    light1.position.y = y;
    light1.position.z = z;

    group.add(light1);//add a mesh with geometry to it

    // Buitenste mesh
    let geometry = new THREE.SphereGeometry(8, 30, 30);

    let material = new THREE.ShaderMaterial({
      uniforms: {
        'c': {type: 'f', value: 1 },
        'p': {type: 'f', value: 1 },
        glowColor: { type: 'c', value: new THREE.Color(parseInt(this.color), 16)},
        viewVector: { type: 'v3', value: camera.position }
      },
      vertexShader: document.getElementById('vertexShader').textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    outerBall = new THREE.Mesh(geometry.clone(), material.clone());
    outerBall.position.x = x;
    outerBall.position.y = y;
    outerBall.position.z = z;

    group.add(outerBall);

    // Glow

    geometry = new THREE.SphereGeometry(8, 60, 60);

    material = new THREE.ShaderMaterial({
      uniforms:
      {
        'c': {type: 'f', value: 0.1},
        'p': {type: 'f', value: 6 },
        glowColor: { type: 'c', value: new THREE.Color(parseInt(this.LightenColor(this.color, 50), 16)) },
        viewVector: { type: 'v3', value: camera.position }
      },
      vertexShader: document.getElementById('vertexShader').textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    middleBall = new THREE.Mesh(geometry.clone(), material.clone());
    middleBall.position.x = x;
    middleBall.position.y = y;
    middleBall.position.z = z;

    group.add(middleBall);

    this.obj.shape = group;

    return this.obj.shape;
  }

  LightenColor(color, percent) {
    let num = parseInt(color, 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      B = (num >> 8 & 0x00FF) + amt,
      G = (num & 0x0000FF) + amt;

    return (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
  }

}
