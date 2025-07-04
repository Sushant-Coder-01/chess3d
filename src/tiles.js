import * as THREE from "three";
import { LABELS, TILES } from "./constant";

// Shared tile geometry
const TILE_SIZE = 1;
const TILE_HEIGHT = 0.1;
const tileGeometry = new THREE.BoxGeometry(TILE_SIZE, TILE_HEIGHT, TILE_SIZE);

// Exported 2D grid for external use
export const tileGrid = [];

export const createTiles = (scene) => {
  const columns = ["A", "B", "C", "D", "E", "F", "G", "H"]; // Column names

  for (let row = 0; row < 8; row++) {
    const rowTiles = [];

    for (let col = 0; col < 8; col++) {
      const isWhite = (row + col) % 2 === 0;

      // Create a new material for each tile (no sharing)
      const tileMaterial = new THREE.MeshBasicMaterial({
        color: isWhite ? TILES.light : TILES.dark,
      });

      const tile = new THREE.Mesh(tileGeometry, tileMaterial);
      tile.position.set(col - 3.5, 0.25, row - 3.5);
      tile.name = `${columns[col]}${8 - row}`; // Row is inverted for chess (8-1 instead of 0-7)
      tile.userData = { row, col, color: isWhite ? TILES.light : TILES.dark };

      scene.add(tile);

      // Create label sprite for each tile
      const sprite = createLabel(tile.name);

      sprite.position.set(
        tile.position.x,
        tile.position.y + 0.06,
        tile.position.z
      ); // Place at top-left corner

      scene.add(sprite);

      rowTiles.push(tile);
    }

    tileGrid.push(rowTiles);
  }
};

function createLabel(text) {
  // Create a sprite with text as a label
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  context.font = "32px Sans-Serif";

  context.fillStyle = LABELS.color;
  context.fillText(text, 50, 50, 50);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
  });

  const sprite = new THREE.Sprite(material);
  sprite.userData = { notation: text };

  return sprite;
}

export const tileFromChessNotation = (tileName) => {
  const columns = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const colLetter = tileName[0].toUpperCase();
  const rowNumber = parseInt(tileName[1]); // 1 to 8

  const col = columns.indexOf(colLetter);
  const row = 8 - rowNumber; // 8 → 0, 1 → 7

  return tileGrid[row][col]; // returns the tile mesh
};
