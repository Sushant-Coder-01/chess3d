import * as THREE from "three";

// Create shared geometry and materials
const tileGeometry = new THREE.BoxGeometry(1, 0.1, 1);
const whiteMaterial = new THREE.MeshBasicMaterial({ color: "white" });
const blackMaterial = new THREE.MeshBasicMaterial({ color: "black" });

export const tileGrid = [];

export const createTiles = (scene) => {
  for (let row = 0; row < 8; row++) {
    const rowTiles = [];

    for (let col = 0; col < 8; col++) {
      const isWhite = (row + col) % 2 === 0;
      const material = isWhite ? whiteMaterial : blackMaterial;

      const tile = new THREE.Mesh(tileGeometry, material);
      tile.position.set(col - 3.5, 0.25, row - 3.5);

      tile.userData = { row, col, color: isWhite ? "white" : "black" };

      scene.add(tile);
      rowTiles.push(tile);
    }

    tileGrid.push(rowTiles);
  }
};
