import { Box3, Box3Helper, Euler, TextureLoader } from "three";
import { scene } from "../scene";
import { tileFromChessNotation } from "../tiles";
import { PIECES, TEXTURES } from "../constant";

// Store king meshes for easy access
export const kings = {};

const createKingInstance = (originalModel, tileName, textureType) => {
  const tile = tileFromChessNotation(tileName);

  const model = originalModel.clone();
  const mesh = model.children[0];
  mesh.material = mesh.material.clone();

  model.position.copy(tile.position);
  model.position.y = 0.8;

  const loader = new TextureLoader();
  const texture = loader.load(textureType);

  mesh.material.map = texture;
  mesh.material.needsUpdate = true;

  mesh.name = `King_${tileName}`;
  model.name = `King_${tileName}`;

  scene.add(model);

  // Store the mesh in the kings object for easy reference
  kings[tileName] = model;
};

export const loadKing = (model) => {
  model.scale.set(16, 16, 16);

  createKingInstance(model, "e1", TEXTURES.marble); // White
  createKingInstance(model, "e8", TEXTURES.wood); // Black
};
