import { Box3, Box3Helper, Euler, Vector3, BoxHelper } from "three";
import { scene } from "../scene";
import { tileGrid } from "../tiles";

const createBishopInstance = (originalMesh, position, color) => {
  const mesh = originalMesh.clone();

  mesh.position.copy(position);
  mesh.scale.set(0.0003, 0.0003, 0.0003);
  mesh.setRotationFromEuler(new Euler(-Math.PI / 2, 0, 0));
  mesh.material.color.set(color);

  // Optional: visualize bounding box
  const box = new Box3().setFromObject(mesh);
  const helper = new Box3Helper(box, color);
  scene.add(helper);

  scene.add(mesh);
};

export const loadBishop = (model) => {
  const originalMesh = model.children[0];

  const bishop_C1 = createBishopInstance(originalMesh, "C1", "#eadcb5");
  const bishop_F1 = createBishopInstance(originalMesh, "F1", "#eadcb5");
  const bishop_C8 = createBishopInstance(originalMesh, "C8", "#fff");
  const bishop_F8 = createBishopInstance(originalMesh, "F8", "#fff");

  console.log(tileGrid);
};
