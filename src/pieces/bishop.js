import {
  Box3,
  Box3Helper,
  Euler,
  Mesh,
  MeshStandardMaterial,
  TextureLoader,
  Vector3,
} from "three";
import { scene } from "../scene";
import { tileFromChessNotation } from "../tiles";
import { PIECES, TEXTURES } from "../constant";

// Store bishop meshes for easy access
export const bishops = {};

// Helper to center geometry
const centerGeometry = (mesh) => {
  mesh.geometry.computeBoundingBox();
  const box = mesh.geometry.boundingBox;
  const center = new Vector3();
  box.getCenter(center);
  mesh.geometry.translate(-center.x, -center.y, -center.z);
};

const loader = new TextureLoader();

export const createBishopInstance = (
  originalModel,
  tileName,
  textureType,
  color
) => {
  const tile = tileFromChessNotation(tileName);
  const model = originalModel.clone();
  let mesh = null;
  model.traverse((child) => {
    if (child.isMesh && !mesh) mesh = child;
  });
  mesh.material = mesh.material.clone();
  // Center geometry before texture loads
  centerGeometry(mesh);

  // Load texture and apply everything after it's loaded
  loader.load(textureType, (texture) => {
    mesh.material = new MeshStandardMaterial({ map: texture });
    mesh.material = new MeshStandardMaterial({
      color: color,
      metalness: 0.1,
      roughness: 0.5,
    });

    mesh.material.map = texture;

    mesh.material.needsUpdate = true;

    model.position.copy(tile.position);
    model.position.y = 0.88;
    model.scale.set(20, 20, 20);

    model.castShadow = true;
    model.receiveShadow = true;

    model.name = `Bishop_${tileName}`;

    model.userData = {
      pieceType: "bishop",
      color: color,
      tileName: tileName,
      initialPosition: tile.position.clone(),
    };

    // Add to scene and store
    scene.add(model);
    bishops[tileName] = model;
  });
};

export const loadBishop = (model) => {
  createBishopInstance(model, "C1", TEXTURES.wood, PIECES.white); // White
  createBishopInstance(model, "F1", TEXTURES.wood, PIECES.white); // White
  createBishopInstance(model, "C8", TEXTURES.wood, PIECES.black); // Black
  createBishopInstance(model, "F8", TEXTURES.wood, PIECES.black); // Black
};
