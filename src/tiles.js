import * as THREE from "three";
import { camera, sizes } from "./scene";

// Shared tile geometry
const TILE_SIZE = 1;
const TILE_HEIGHT = 0.1;
const tileGeometry = new THREE.BoxGeometry(TILE_SIZE, TILE_HEIGHT, TILE_SIZE);

// Exported 2D grid for external use
export const tileGrid = [];

let lastHighlighted = null;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export const createTiles = (scene) => {
  const columns = ["A", "B", "C", "D", "E", "F", "G", "H"]; // Column names

  for (let row = 0; row < 8; row++) {
    const rowTiles = [];

    for (let col = 0; col < 8; col++) {
      const isWhite = (row + col) % 2 === 0;

      // Create a new material for each tile (no sharing)
      const tileMaterial = new THREE.MeshBasicMaterial({
        color: isWhite ? "white" : "black",
      });

      const tile = new THREE.Mesh(tileGeometry, tileMaterial);
      tile.position.set(col - 3.5, 0.25, row - 3.5);
      tile.name = `${columns[col]}${8 - row}`; // Row is inverted for chess (8-1 instead of 0-7)
      tile.userData = { row, col, color: isWhite ? "white" : "black" };

      scene.add(tile);

      // Create label sprite for each tile
      const sprite = createLabel(tile.name);
      sprite.position.set(tile.position.x, tile.position.y, tile.position.z); // Place at top-left corner

      scene.add(sprite);

      rowTiles.push(tile);
    }

    tileGrid.push(rowTiles);
  }

  // Register click interaction
  window.addEventListener("click", handleTileClick(scene));
};

function createLabel(text) {
  // Create a sprite with text as a label
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = "24px Arial";
  context.fillStyle = "#b7b7b7";
  context.fillText(text, 50, 50, 100);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);

  return sprite;
}

function handleTileClick(scene) {
  return function (event) {
    // Convert mouse to normalized device coordinates
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = -(event.clientY / sizes.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Intersect with all scene objects
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
      const clicked = intersects[0].object;
      if (clicked.name.startsWith("tile")) {
        highlightTile(clicked);
      }
    }
  };
}

function highlightTile(tile) {
  // Restore previous tile color
  if (lastHighlighted) {
    lastHighlighted.material.color.set(lastHighlighted.originalColor);
  }

  // Save original color and highlight
  tile.originalColor = tile.material.color.getHex();
  tile.material.color.set("#E99F51"); // cyan
  lastHighlighted = tile;
}
