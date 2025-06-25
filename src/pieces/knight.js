import {
  Vector3,
  MeshStandardMaterial,
  TextureLoader,
  Box3,
  Box3Helper,
} from "three";
import { scene } from "../scene";
import { tileFromChessNotation } from "../tiles";
import { PIECES, TEXTURES } from "../constant";

// Store knight meshes for easy access
export const knights = {};

const loader = new TextureLoader();

const centerGeometry = (mesh) => {
  mesh.geometry.computeBoundingBox();
  const box = mesh.geometry.boundingBox;
  const center = new Vector3();
  box.getCenter(center);
  mesh.geometry.translate(-center.x, -center.y, -center.z);
};

const createKnightInstance = (
  originalModel,
  tileName,
  textureType,
  color,
  pose
) => {
  const tile = tileFromChessNotation(tileName);

  const model = originalModel.clone();

  model.traverse((child) => {
    if (child.isMesh) {
      if (child.name === "Vert004_Material003_0") {
        child.scale.set(1, 1, 1);

        child.material = child.material.clone();

        centerGeometry(child);
      }
      if (child.name === "Plane001_Material003_0") {
        child.scale.set(1, 1, 1);
        child.position.z = 0.25;
        child.material = child.material.clone();
        centerGeometry(child);
      }

      loader.load(textureType, (texture) => {
        child.material = new MeshStandardMaterial({
          color: color,
        });
        child.material.needsUpdate = true;
      });
    }
  });

  model.position.copy(tile.position);
  model.position.y = 0.5;
  model.scale.set(0.8, 0.8, 0.8);

  if (pose === "black") {
    model.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
  } else {
    model.rotation.set(-Math.PI / 2, 0, -Math.PI / 2);
  }

  model.name = `Knight_${tileName}`;

  scene.add(model);

  knights[tileName] = model;
};

export const loadKnight = (model) => {
  // Create white knights

  createKnightInstance(model, "b1", TEXTURES.marble, PIECES.white, "white"); // White Knight (b1)
  createKnightInstance(model, "g1", TEXTURES.marble, PIECES.white, "white"); // White Knight (g1)

  // Create black knights
  createKnightInstance(model, "b8", TEXTURES.wood, PIECES.black, "black"); // Black Knight (b8)
  createKnightInstance(model, "g8", TEXTURES.wood, PIECES.black, "black"); // Black Knight (g8)
};
