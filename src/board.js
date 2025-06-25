import * as THREE from "three";
import { createTiles } from "./tiles";

function createBoard(scene) {
  const chessBoardGeometry = new THREE.BoxGeometry(8.1, 0.5, 8.1);
  const chessBoardMaterial = new THREE.MeshBasicMaterial({ color: "#555" });
  const chessBoardMesh = new THREE.Mesh(chessBoardGeometry, chessBoardMaterial);
  scene.add(chessBoardMesh);

  // Add tiles
  createTiles(scene);
}

export { createBoard };
