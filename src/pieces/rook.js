import { Vector3, Box3, MeshStandardMaterial, Euler } from "three";
import { scene } from "../scene";
import { PIECES } from "../constant";
import { tileFromChessNotation } from "../tiles";

// Optional: store if needed
export const rooks = {};

// Helper to center mesh geometry
const centerGeometry = (mesh) => {
  mesh.geometry.computeBoundingBox();
  const box = mesh.geometry.boundingBox;
  const center = new Vector3();
  box.getCenter(center);
  mesh.geometry.translate(-center.x, -center.y, -center.z);
};

export const createRookInstance = (originalModel, tileName, color) => {
  const tile = tileFromChessNotation(tileName);
  const model = originalModel.clone();

  let mesh = null;
  model.traverse((child) => {
    if (child.isMesh) {
      mesh = child;
      mesh.material = new MeshStandardMaterial({ color });
      centerGeometry(mesh);
    }
  });

  model.position.copy(tile.position);
  model.position.y = 0.8;
  model.scale.set(0.0003, 0.0003, 0.0003); // scale down massively
  model.setRotationFromEuler(new Euler(-Math.PI / 2, 0, 0));

  model.name = `Rook_${tileName}`;

  scene.add(model);
  rooks[tileName] = model;
};

export const loadRook = (model) => {
  // White Rooks
  createRookInstance(model, "A1", PIECES.white);
  createRookInstance(model, "H1", PIECES.white);

  // Black Rooks
  createRookInstance(model, "A8", PIECES.black);
  createRookInstance(model, "H8", PIECES.black);
};
