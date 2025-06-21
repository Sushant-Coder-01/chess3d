import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { scene } from "./scene";

function createBoard(scene) {
  const chessBoardGeometry = new THREE.BoxGeometry(8.1, 0.5, 8.1);
  const chessBoardMaterial = new THREE.MeshBasicMaterial({ color: "#555" });
  const chessBoardMesh = new THREE.Mesh(chessBoardGeometry, chessBoardMaterial);
  scene.add(chessBoardMesh);
}

const loader = new GLTFLoader();

loader.load(
  "/models/queen/scene.gltf",
  (gltf) => {
    const model = gltf.scene;

    model.traverse((child) => {
      if (child.isMesh) {
        child.geometry.computeBoundingBox();
        const box = child.geometry.boundingBox;
        const center = new THREE.Vector3();
        box.getCenter(center);
        child.geometry.translate(-center.x, -box.min.y, -center.z); // recenters it
      }
    });

    const box = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    box.getCenter(center);

    model.position.sub(center); // move
    model.scale.set(0.01, 0.01, 0.01); // or even smaller if needed

    console.log(model);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    scene.add(model);
  },
  undefined,
  (error) => {
    console.error("Error loading model:", error);
  }
);

export { createBoard };
