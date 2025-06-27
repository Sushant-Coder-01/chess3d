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
      centerGeometry(child);

      loader.load(textureType, (texture) => {
        child.material = new MeshStandardMaterial({ map: texture });
        child.material = new MeshStandardMaterial({
          color: color,
          metalness: 0.1,
          roughness: 0.5,
        });
        child.material.map = texture;
        child.material.needsUpdate = true;

        // Position the knight on the chessboard
        model.position.copy(tile.position);
        model.position.y = 0.88;
        model.scale.set(0.35, 0.35, 0.35);

        // Adjust rotation based on the knight's color
        if (pose === "black") {
          model.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
        } else {
          model.rotation.set(-Math.PI / 2, 0, -Math.PI / 2);
        }

        model.name = `Knight_${tileName}`;

        // Add the knight model to the scene
        scene.add(model);

        knights[tileName] = model;
      });
    }
  });
};

// Load knight models for both white and black pieces
export const loadKnight = (model) => {
  // Create white knights on their respective tiles
  createKnightInstance(model, "b1", TEXTURES.wood, PIECES.white, "white"); // White Knight (b1)
  createKnightInstance(model, "g1", TEXTURES.wood, PIECES.white, "white"); // White Knight (g1)

  // Create black knights on their respective tiles
  createKnightInstance(model, "b8", TEXTURES.wood, PIECES.black, "black"); // Black Knight (b8)
  createKnightInstance(model, "g8", TEXTURES.wood, PIECES.black, "black"); // Black Knight (g8)
};
