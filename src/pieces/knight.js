import { Vector3, MeshStandardMaterial, TextureLoader } from "three";
import { scene } from "../scene";
import { tileFromChessNotation } from "../tiles";
import { PIECES, TEXTURES } from "../constant";

// Store knight meshes for easy access
export const knights = {};

const loader = new TextureLoader();

// Center the geometry to make sure it's positioned correctly
const centerGeometry = (mesh) => {
  mesh.geometry.computeBoundingBox();
  const box = mesh.geometry.boundingBox;
  const center = new Vector3();
  box.getCenter(center);
  mesh.geometry.translate(-center.x, -center.y, -center.z);
};

// Create the knight model for each tile
const createKnightInstance = async (
  originalModel,
  tileName,
  textureType,
  color,
  pose
) => {
  const tile = tileFromChessNotation(tileName);
  const model = originalModel.clone();

  const texture = await loader.loadAsync(textureType);

  model.traverse((child) => {
    if (child.isMesh) {
      centerGeometry(child);
      child.material = new MeshStandardMaterial({
        map: texture,
        color: color,
        metalness: 0.1,
        roughness: 0.5,
      });
      child.material.needsUpdate = true;
    }
  });

  // Apply transforms
  model.position.copy(tile.position);
  model.position.y = 0.88;
  model.scale.set(0.35, 0.35, 0.35);
  model.rotation.set(
    -Math.PI / 2,
    0,
    pose === "black" ? Math.PI / 2 : -Math.PI / 2
  );
  model.name = `Knight_${tileName}`;

  // Add to scene and object store
  scene.add(model);
  knights[tileName] = model;
};

// Load knight models for both white and black pieces
export const loadKnight = async (model) => {
  // Create white knights on their respective tiles
  await createKnightInstance(model, "b1", TEXTURES.wood, PIECES.white, "white"); // White Knight (b1)
  await createKnightInstance(model, "g1", TEXTURES.wood, PIECES.white, "white"); // White Knight (g1)

  // Create black knights on their respective tiles
  await createKnightInstance(model, "b8", TEXTURES.wood, PIECES.black, "black"); // Black Knight (b8)
  await createKnightInstance(model, "g8", TEXTURES.wood, PIECES.black, "black"); // Black Knight (g8)
};
