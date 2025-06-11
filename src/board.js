import * as THREE from "three";

function createBoard(scene) {
  const chessBoardGeometry = new THREE.BoxGeometry(8.1, 0.5, 8.1);
  const chessBoardMaterial = new THREE.MeshBasicMaterial({ color: "#555" });
  const chessBoardMesh = new THREE.Mesh(chessBoardGeometry, chessBoardMaterial);
  scene.add(chessBoardMesh);
}

export { createBoard };
