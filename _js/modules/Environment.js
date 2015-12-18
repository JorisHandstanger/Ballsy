'use strict';

import {lightenColor, getAverageValue} from '../helpers/util';

export default class Environment {

  constructor(){

    this.grid = new THREE.GridHelper(1000, 270);
    this.grid2 = new THREE.GridHelper(1000, 90);
    this.grid3 = new THREE.GridHelper(1000, 30);

    this.tower = {};

    this.obj = {};

  }

  update(array){
    let lowtones = ((getAverageValue(array, 1, 5))/255)*100;
    let midtones = ((getAverageValue(array, 6, 10))/255)*100;
    let hightones = ((getAverageValue(array, 11, 15))/255)*100;

    let gridcolor3 = 0x02070d;
    let gridcolor2 = 0x250935;
    let gridcolor = 0x350926;

    let newColor = new THREE.Color(parseInt(lightenColor(gridcolor, lowtones), 16));
    let newColor2 = new THREE.Color(parseInt(lightenColor(gridcolor2, midtones), 16));
    let newColor3 = new THREE.Color(parseInt(lightenColor(gridcolor3, hightones), 16));

    this.grid.setColors( newColor, newColor );
    this.grid2.setColors( newColor2, newColor2 );
    this.grid3.setColors( newColor3, newColor3 );

    if(this.tower.type === "Group"){
      this.tower.children[0].children[0].material.color = newColor3;
      this.tower.children[1].children[0].children[0].material.color = newColor3;

      this.tower.scale.set(0.3, 0.3 + hightones/300, 0.3);
      this.tower.position.set(-12, 153 + hightones*1.5, -12);
    }
  }

  render(){

    let group = new THREE.Object3D();

    // floor
    let geometry = new THREE.PlaneGeometry( 2000, 2000 );
    geometry.rotateX(-Math.PI / 2 );

    let material = new THREE.MeshPhongMaterial( {
      color: 0x000000,
      specular: 0x0F0F0F,
      shininess: 60
    });

    let mesh = new THREE.Mesh( geometry, material );
    group.add( mesh );



    this.grid.setColors( new THREE.Color(0x333333), new THREE.Color(0x333333) );
    this.grid.position.y = 1;
    this.grid.material.opacity = 0.6;
    group.add(this.grid);

    this.grid2.setColors( new THREE.Color(0x333333), new THREE.Color(0x333333) );
    this.grid2.position.y = 2;
    this.grid2.material.opacity = 0.6;
    group.add(this.grid2);

    this.grid3.setColors( new THREE.Color(0x333333), new THREE.Color(0x333333) );
    this.grid3.position.y = 3;
    this.grid3.material.opacity = 0.6;

    group.add(this.grid3);

    // center piece

    let loader = new THREE.ColladaLoader();

    loader.load(
      // resource URL
      './assets/abstract.dae',
      // Function when resource is loaded
      ( collada ) => {
        this.tower = collada.scene;

        let towerMaterial = new THREE.MeshLambertMaterial({
          color: parseInt(0x02070d),
          transparent: true,
          opacity: 0.6
        });

        this.tower.children[0].children[0].material = towerMaterial;
        this.tower.children[1].children[0].children[0].material = towerMaterial;

        group.add( this.tower );
        this.tower.position.set(0, 153, 0);
        this.tower.rotation.set(0, 0, 0);
        this.tower.scale.set(0.3, 0.3, 0.3);
      }
    );

    this.obj.shape = group;

    return this.obj.shape;
  }

}
