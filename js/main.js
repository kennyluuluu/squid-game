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
const text = document.querySelector(".text");
const TIME_LIMIT = 10;
let gameState = "loading";

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

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

  async start() {
    if (gameState === "started") {
      this.lookBackward();
      await delay(1000 + Math.random() * 1000);
      this.lookForward();
      await delay(750 + Math.random() * 750);
    }
    this.start();
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

class Player {
  constructor() {
    const geometry = new THREE.SphereGeometry(0.2, 32, 16);
    const material = new THREE.MeshBasicMaterial({ color: "blue" });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.z = 1;
    sphere.position.x = start_position;
    scene.add(sphere);
    this.player = sphere;
    this.playerInfo = {
      positionX: start_position,
      velocity: 0.0,
    };
  }

  run() {
    this.playerInfo.velocity = 0.03;
  }

  stop() {
    gsap.to(this.playerInfo, { velocity: 0, duration: 0.1 });
  }

  checkVictory() {}

  update() {
    this.checkVictory();
    this.playerInfo.positionX -= this.playerInfo.velocity;
    this.player.position.x = this.playerInfo.positionX;
  }
}

let player1 = new Player();
let doll = new Doll();
createTrack();

async function init() {
  await delay(500);
  // text.innerText = "Starting in 3";
  await delay(1000);
  // text.innerText = "Starting in 2";
  await delay(1000);
  // text.innerText = "Starting in 1";
  await delay(1000);
  // text.innerText = "Go!";
  startGame();
}
init();

function startGame() {
  let timeBar = createCube({ w: 5, h: 0.1, d: 0.1 }, 0, 0, "green");
  timeBar.position.y = 3.35;
  gsap.to(timeBar.scale, { x: 0, duration: TIME_LIMIT, ease: "none" });
  gameState = "started";
  doll.start();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  player1.update();
}
animate();

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("keydown", (e) => {
  if (gameState == "started" && e.key == "ArrowUp") {
    player1.run();
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key == "ArrowUp") {
    player1.stop();
  }
});
