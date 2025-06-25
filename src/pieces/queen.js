import { MeshStandardMaterial, TextureLoader, Vector3 } from "three";
import { scene } from "../scene";
import { PIECES, TEXTURES } from "../constant";
import { tileFromChessNotation } from "../tiles";

// Store queen meshes for easy access
export const queens = {};

const loader = new TextureLoader();

const centerGeometry = (mesh) => {
  mesh.geometry.computeBoundingBox();
  const box = mesh.geometry.boundingBox;
  const center = new Vector3();
  box.getCenter(center);
  mesh.geometry.translate(-center.x, -center.y, -center.z);
};

const createQueenInstance = (
  originalModel,
  tileName,
  textureType,
  color,
  pose
) => {
  const tile = tileFromChessNotation(tileName);

  const model = originalModel.clone();
  let mesh = null;
  model.traverse((child) => {
    if (child.isMesh) {
      mesh = child;
    }
  });
  mesh.material.color.set(color);

  model.position.copy(tile.position);
  model.position.y = 1;
  model.scale.set(0.65, 0.65, 0.65);

  model.name = `Queen_${tileName}`;

  scene.add(model);

  queens[tileName] = model;
};

export const loadQueen = (model) => {
  // Create white queens
  createQueenInstance(model, "d1", TEXTURES.marble, PIECES.white, "white"); // White Queen (d1)

  // Create black queens
  createQueenInstance(model, "d8", TEXTURES.wood, PIECES.black, "black"); // Black Queen (d8)
};
