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

const createBishopInstance = (originalMesh, tileName, textureType) => {
  const tile = tileFromChessNotation(tileName);
  const mesh = originalMesh.clone();
  mesh.material = mesh.material.clone();

  const loader = new TextureLoader();

  // Load texture asynchronously and apply once it's loaded
  const texture = loader.load(textureType, () => {
    mesh.material.map = texture;
    mesh.material.needsUpdate = true; // Make sure material updates
  });

  mesh.position.copy(tile.position);
  mesh.position.y = 0.95;

  // Adjust scale if needed
  mesh.scale.set(0.0003, 0.0003, 0.0003);

  // Correct rotation of the mesh
  mesh.setRotationFromEuler(new Euler(-Math.PI / 2, 0, 0));

  mesh.name = `Bishop_${tileName}`;

  scene.add(mesh);

  // Store mesh in bishops object
  bishops[tileName] = mesh;
};

export const loadBishop = (model) => {
  const originalMesh = model.children[0];

  originalMesh.geometry.computeBoundingBox();
  const box = originalMesh.geometry.boundingBox;
  const center = new Vector3();
  box.getCenter(center);
  originalMesh.geometry.translate(-center.x, -center.y, -center.z);

  createBishopInstance(originalMesh, "C1", TEXTURES.metal); // White
  createBishopInstance(originalMesh, "F1", TEXTURES.marble); // White
  createBishopInstance(originalMesh, "C8", TEXTURES.wood); // Black
  createBishopInstance(originalMesh, "F8", TEXTURES.wood); // Black
};
