import {
  Vector3,
  Box3,
  MeshStandardMaterial,
  Euler,
  TextureLoader,
} from "three";
import { scene } from "../scene";
import { PIECES, TEXTURES } from "../constant";
import { tileFromChessNotation } from "../tiles";

// Optional: store if needed
export const rooks = {};

const loader = new TextureLoader();

// Helper to center mesh geometry
const centerGeometry = (mesh) => {
  mesh.geometry.computeBoundingBox();
  const box = mesh.geometry.boundingBox;
  const center = new Vector3();
  box.getCenter(center);
  mesh.geometry.translate(-center.x, -center.y, -center.z);
};

export const createRookInstance = (
  originalModel,
  tileName,
  textureType,
  color
) => {
  const tile = tileFromChessNotation(tileName);
  const model = originalModel.clone();

  let mesh = null;
  model.traverse((child) => {
    if (child.isMesh) {
      mesh = child;
      centerGeometry(mesh);
    }
  });

  loader.load(textureType, (texture) => {
    mesh.material = new MeshStandardMaterial({
      map: texture,
      color: color,
      metalness: 0.1,
      roughness: 0.5,
    });

    mesh.material.needsUpdate = true;

    model.position.copy(tile.position);
    model.position.y = 0.8;
    model.scale.set(0.7, 0.7, 0.7);
    model.setRotationFromEuler(new Euler(-Math.PI / 2, 0, 0));

    model.castShadow = true;
    model.receiveShadow = true;

    model.name = `Rook_${tileName}`;

    model.userData = {
      pieceType: "rook",
      color: color,
      tileName: tileName,
      initialPosition: tile.position.clone(),
    };

    scene.add(model);
    rooks[tileName] = model;
  });
};

export const loadRook = (model) => {
  // White Rooks
  createRookInstance(model, "A1", TEXTURES.wood, PIECES.white);
  createRookInstance(model, "H1", TEXTURES.wood, PIECES.white);

  // Black Rooks
  createRookInstance(model, "A8", TEXTURES.wood, PIECES.black);
  createRookInstance(model, "H8", TEXTURES.wood, PIECES.black);
};
