'use strict';

import {lightenColor} from '../helpers/util';

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
      color: parseInt(lightenColor(this.color, 50), 16)
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

}
