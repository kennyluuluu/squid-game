const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// GLOBAL VARIABLES
const start_position = 3;
const end_position = -start_position;

function createCube(size, positionX, rotationY = 0, color = 0xfbc851) {
  const geometry = new THREE.BoxGeometry(size.w, size.h, size.d);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.x = positionX;
  cube.rotation.y = rotationY;
  scene.add(cube);
  return cube;
}

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0xffffff, 1);

const light = new THREE.AmbientLight(0xffffff); // soft white light
scene.add(light);

// Load a glTF resource
const loader = new THREE.GLTFLoader();

class Doll {
  constructor() {
    loader.load(
      // resource URL
      "../model/scene.gltf",
      // called when the resource is loaded
      (gltf) => {
        scene.add(gltf.scene);
        gltf.scene.scale.set(0.4, 0.4, 0.4);
        gltf.scene.position.set(0, -1, 0);
        this.doll = gltf.scene;

        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object
      },
      // called while loading is progressing
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function (error) {
        console.log("An error happened");
      }
    );
  }

  lookBackward() {
    gsap.to(this.doll.rotation, { y: -3.15, duration: 1 });
  }

  lookForward() {
    gsap.to(this.doll.rotation, { y: 0, duration: 1 });
  }
}

function createTrack() {
  createCube(
    { w: start_position * 2 + 0.2, h: 1.5, d: 1 },
    0,
    0,
    0xe5a716
  ).position.z = -1;
  createCube({ w: 0.2, h: 1.5, d: 1 }, start_position, -0.35);
  createCube({ w: 0.2, h: 1.5, d: 1 }, end_position, 0.35);
}
createTrack();
let doll = new Doll();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
