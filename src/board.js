import * as THREE from "three";
import { createTiles } from "./tiles";
import { BOARDCOLOR, TEXTURES } from "./constant";

const loader = new THREE.TextureLoader();

function createBoard(scene) {
  const chessBoardGeometry = new THREE.BoxGeometry(8.1, 0.5, 8.1);
  const chessBoardMaterial = new THREE.MeshBasicMaterial({ color: "#555" });
  const chessBoardMesh = new THREE.Mesh(chessBoardGeometry, chessBoardMaterial);

  loader.load(TEXTURES.woodBaseColor, (texture) => {
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      color: BOARDCOLOR.color,
      metalness: 0.1,
      roughness: 0.5,
    });

    chessBoardMesh.material = material;

    scene.add(chessBoardMesh);

    // Add tiles
    createTiles(scene);
  });
}

export { createBoard };
