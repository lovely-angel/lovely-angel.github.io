import * as THREE from 'https://cdn.skypack.dev/three@0.112.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.112.0/examples/jsm/controls/OrbitControls.js';
import TWEEN from 'https://cdn.skypack.dev/@tweenjs/tween.js';

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const nbButterflies = 40;
var conf, scene, camera, cameraCtrl, light, renderer;
var whw, whh;

var renderer;

var butterflies;
var bodyTexture, wingTexture1, wingTexture2, wingTexture3, bodyTexture4, wingTexture4;
var destination = new THREE.Vector3();

var mouse = new THREE.Vector2();
var mouseOver = false;
var mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
var mousePosition = new THREE.Vector3();
var raycaster = new THREE.Raycaster();

const attraction = isMobile ? 0.1 : 0.075;

function init() {
  conf = {
    attraction: attraction,
    velocityLimit: 1.4,
    move: true,
    followMouse: true,
    shuffle: shuffle
  };

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  cameraCtrl = new OrbitControls(camera, renderer.domElement);

  initScene();

  onWindowResize();
  window.addEventListener('resize', onWindowResize, false);

  document.addEventListener('mousemove', onMouseMove, false);
  // document.addEventListener('mouseover', function () { mouseOver = true; }, false);
  document.addEventListener('mouseout', function () { mouseOver = false; }, false);

  animate();
};

function initScene() {
  scene = new THREE.Scene();

  camera.position.z = 75;
  bodyTexture = new THREE.TextureLoader().load('https://klevron.github.io/codepen/butterflies/b1.png');
  wingTexture1 = new THREE.TextureLoader().load('https://klevron.github.io/codepen/butterflies/b1w.png');
  wingTexture2 = new THREE.TextureLoader().load('https://klevron.github.io/codepen/butterflies/b2w.png');
  wingTexture3 = new THREE.TextureLoader().load('https://klevron.github.io/codepen/butterflies/b3w.png');
  bodyTexture4 = new THREE.TextureLoader().load('https://klevron.github.io/codepen/butterflies/b4.png');
  wingTexture4 = new THREE.TextureLoader().load('https://klevron.github.io/codepen/butterflies/b4w.png');
  
  butterflies = [];
  for (var i = 0; i < nbButterflies; i++) {
    var b = new Butterfly();
    butterflies.push(b);
    scene.add(b.o3d);
  }

  shuffle();
}

function animate() {
  requestAnimationFrame(animate);

  TWEEN.update();

  cameraCtrl.update();

  if (conf.move) {
    for (var i = 0; i < butterflies.length; i++) {
      butterflies[i].move();
    }
  }

  renderer.render(scene, camera);
};

function shuffle() {
  for (var i = 0; i < butterflies.length; i++) {
    butterflies[i].shuffle();
  }
}

class Butterfly {
  constructor() {
    this.minWingRotation = -Math.PI / 6;
    this.maxWingRotation = Math.PI / 2 - 0.1;
    this.wingRotation = 0;

    this.velocity = new THREE.Vector3(rnd(1, true), rnd(1, true), rnd(1, true));
    this.destination = destination;

    var confs = [
      { bodyTexture: bodyTexture, bodyW: 10, bodyH: 15, wingTexture: wingTexture1, wingW: 10, wingH: 15, wingX: 5.5 },
      { bodyTexture: bodyTexture, bodyW: 6, bodyH: 9, wingTexture: wingTexture2, wingW: 15, wingH: 20, wingX: 7.5 },
      { bodyTexture: bodyTexture, bodyW: 8, bodyH: 12, wingTexture: wingTexture3, wingW: 10, wingH: 15, wingX: 5.5 },
      { bodyTexture: bodyTexture4, bodyW: 6, bodyH: 10, bodyY: 2, wingTexture: wingTexture4, wingW: 15, wingH: 20, wingX: 8 },
    ];

    this.init(confs[Math.floor(rnd(4))]);
  }
  init(bconf) {
    var geometry = new THREE.PlaneGeometry(bconf.wingW, bconf.wingH);
    var material = new THREE.MeshBasicMaterial({ transparent: true, map: bconf.wingTexture, side: THREE.DoubleSide, depthTest: false });
    var lwmesh = new THREE.Mesh(geometry, material);
    lwmesh.position.x = -bconf.wingX;
    this.lwing = new THREE.Object3D();
    this.lwing.add(lwmesh);

    var rwmesh = new THREE.Mesh(geometry, material);
    rwmesh.rotation.y = Math.PI;
    rwmesh.position.x = bconf.wingX;
    this.rwing = new THREE.Object3D();
    this.rwing.add(rwmesh);

    geometry = new THREE.PlaneGeometry(bconf.bodyW, bconf.bodyH);
    material = new THREE.MeshBasicMaterial({ transparent: true, map: bconf.bodyTexture, side: THREE.DoubleSide, depthTest: false });
    this.body = new THREE.Mesh(geometry, material);
    if (bconf.bodyY) this.body.position.y = bconf.bodyY;
    // this.body.position.z = -0.1;
    this.group = new THREE.Object3D();
    this.group.add(this.body);
    this.group.add(this.lwing);
    this.group.add(this.rwing);
    this.group.rotation.x = Math.PI / 2;
    this.group.rotation.y = Math.PI;

    this.setWingRotation(this.wingRotation);
    this.initTween();

    this.o3d = new THREE.Object3D();
    this.o3d.add(this.group);
  }
  initTween() {
    var duration = limit(conf.velocityLimit - this.velocity.length(), 0.1, 1.5) * 1000;
    this.wingRotation = this.minWingRotation;
    this.tweenWingRotation = new TWEEN.Tween(this)
      .to({ wingRotation: this.maxWingRotation }, duration)
      .repeat(1)
      .yoyo(true)
      // .easing(TWEEN.Easing.Cubic.InOut)
      .onComplete(function (object) {
        object.initTween();
      })
      .start();
  }
  move() {
    var destination;
    if (mouseOver && conf.followMouse) {
      destination = mousePosition;
    } else {
      destination = this.destination;
    }

    var dv = destination.clone().sub(this.o3d.position).normalize();
    this.velocity.x += conf.attraction * dv.x;
    this.velocity.y += conf.attraction * dv.y;
    this.velocity.z += conf.attraction * dv.z;
    this.limitVelocity();

    // update position & rotation
    this.setWingRotation(this.wingRotation);
    this.o3d.lookAt(this.o3d.position.clone().add(this.velocity));
    this.o3d.position.add(this.velocity);
  }
  limitVelocity(y) {
    this.velocity.x = limit(this.velocity.x, -conf.velocityLimit, conf.velocityLimit);
    this.velocity.y = limit(this.velocity.y, -conf.velocityLimit, conf.velocityLimit);
    this.velocity.z = limit(this.velocity.z, -conf.velocityLimit, conf.velocityLimit);
  }
  setWingRotation(y) {
    this.lwing.rotation.y = y;
    this.rwing.rotation.y = -y;
  }
  shuffle() {
    this.velocity = new THREE.Vector3(rnd(1, true), rnd(1, true), rnd(1, true));
    var p = new THREE.Vector3(rnd(1, true), rnd(1, true), rnd(1, true)).normalize().multiplyScalar(100);
    this.o3d.position.set(p.x, p.y, p.z);
    var scale = rnd(0.4) + 0.1;
    this.o3d.scale.set(scale, scale, scale);
  }
}







function limit(number, min, max) {
  return Math.min(Math.max(number, min), max);
}

function rnd(max, negative) {
  return negative ? Math.random() * 2 * max - max : Math.random() * max;
}

function onWindowResize() {
  whw = window.innerWidth / 2;
  whh = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
  // if (cameraCtrl.getState()!=-1) return;

  var v = new THREE.Vector3();
  camera.getWorldDirection(v);
  v.normalize();
  // console.log(v);
  mousePlane.normal = v;

  mouseOver = true;
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(mousePlane, mousePosition);
}

init();

const customCursor = document.getElementById('custom-cursor');

document.addEventListener('mousemove', (e) => {
    customCursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});

document.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    customCursor.style.transform = `translate(${touch.clientX}px, ${touch.clientY}px)`;
    customCursor.style.display = 'block';
});

if (isMobile) {
    customCursor.style.display = 'block';
}

window.addEventListener('load', () => {
  document.getElementById('text').style.opacity = 1;
});

document.addEventListener('DOMContentLoaded', (event) => {
  const hint = document.getElementById('hint');
  document.addEventListener('click', function() {
      hint.style.opacity = 0;
  });
});
