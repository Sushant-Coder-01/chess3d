import { MeshStandardMaterial, TextureLoader, Vector3 } from "three";
import { scene } from "../scene";
import { PIECES, TEXTURES } from "../constant";
import { tileFromChessNotation } from "../tiles";

// Store pawns for access
export const pawns = {};

// Helper to center geometry
const centerGeometry = (mesh) => {
  mesh.geometry.computeBoundingBox();
  const box = mesh.geometry.boundingBox;
  const center = new Vector3();
  box.getCenter(center);
  mesh.geometry.translate(-center.x, -center.y, -center.z);
};
const loader = new TextureLoader();

const createPawnInstance = (originalModel, tileName, textureType, color) => {
  const tile = tileFromChessNotation(tileName);

  const model = originalModel.clone();
  let mesh = null;
  model.traverse((child) => {
    if (child.isMesh) {
      mesh = child;
    }
  });
  mesh.material = mesh.material.clone();

  // Center geometry (only once per originalMesh clone)
  centerGeometry(mesh);

  // Texture
  loader.load(textureType, (texture) => {
    mesh.material = new MeshStandardMaterial({ map: texture });
    mesh.material = new MeshStandardMaterial({
      color: color,
      metalness: 0.1,
      roughness: 0.5,
    });
    mesh.material.map = texture;

    mesh.material.needsUpdate = true;

    // Position on tile
    model.position.copy(tile.position);
    model.position.y = 0.7;
    model.scale.set(0.2, 0.2, 0.2);

    model.name = `Pawn_${tileName}`;
    scene.add(model);
    pawns[tileName] = model;
  });
};

export const loadPawn = (model) => {
  const pawnTilesWhite = ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"];
  const pawnTilesBlack = ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"];

  for (const tile of pawnTilesWhite) {
    createPawnInstance(model, tile, TEXTURES.wood, PIECES.white);
  }
  for (const tile of pawnTilesBlack) {
    createPawnInstance(model, tile, TEXTURES.wood, PIECES.black);
  }
};
