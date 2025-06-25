import {
  Box3,
  Box3Helper,
  Euler,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  Vector3,
} from "three";
import { scene } from "../scene";
import { tileFromChessNotation } from "../tiles";

// Store bishop meshes for easy access
export const bishops = {};

const createBishopInstance = (originalMesh, tileName, color) => {
  const tile = tileFromChessNotation(tileName);
  const mesh = originalMesh.clone();
  mesh.material = mesh.material.clone();

  const bbox = new Box3().setFromObject(mesh);
  const center = new Vector3();
  bbox.getCenter(center);
  mesh.position.sub(center);

  mesh.position.copy(tile.position);

  mesh.position.y = 1;
  mesh.scale.set(0.0003, 0.0003, 0.0003);
  mesh.setRotationFromEuler(new Euler(-Math.PI / 2, 0, 0));
  mesh.material.color.set(`${color}`);
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

  createBishopInstance(originalMesh, "C1", "#d0d0d0"); // White
  createBishopInstance(originalMesh, "F1", "#d0d0d0"); // White
  createBishopInstance(originalMesh, "C8", "#8c7f71"); // Black
  createBishopInstance(originalMesh, "F8", "#8c7f71"); // Black
};
