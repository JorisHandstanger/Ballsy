'use strict';

export default class Orb {

  constructor(id, position, color){

    this.id = id;
    this.color = color;
    this.position = position;

    this.health = 100;

    this.obj = {};

  }

  update(){

    let time = performance.now();
    let sineScale = 1 - (Math.sin(time/800 - 1)/8);

    this.obj.shape.children[0].intensity = (sineScale*2);
    this.obj.shape.children[1].scale.set(sineScale, sineScale, sineScale);

    this.obj.shape.children[1].material.opacity = this.health/100;

  }

  render(){

    let {x, y, z} = this.position;

    let group = new THREE.Object3D();

    let outerBall;
    let light1;

    // Licht bal
    let sphere = new THREE.SphereGeometry( 3, 30, 30 );

    light1 = new THREE.PointLight( parseInt(this.color, 16), 3, 30 );
    light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( {
      color: parseInt(this.LightenColor(this.color, 50), 16)
    })));
    light1.position.set(x, y, z);
    light1.name = this.id;

    group.add(light1);

    // Buitenste mesh
    let geometry = new THREE.SphereGeometry(8, 30, 30);

    let material = new THREE.MeshLambertMaterial({
      color: parseInt(this.color),
      transparent: true,
      opacity: 0.3
    });

    outerBall = new THREE.Mesh(geometry.clone(), material.clone());
    outerBall.position.set(x, y, z);

    outerBall.name = this.id;

    group.add(outerBall);

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
