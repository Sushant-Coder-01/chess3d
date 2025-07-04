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

const createQueenInstance = (originalModel, tileName, textureType, color) => {
  const tile = tileFromChessNotation(tileName);

  const model = originalModel.clone();
  let mesh = null;
  model.traverse((child) => {
    if (child.isMesh) {
      mesh = child;
    }
  });
  mesh.material.color.set(color);

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
    model.position.y = 0.3;
    model.scale.set(0.12, 0.12, 0.12);

    model.name = `Queen_${tileName}`;

    model.userData = {
      pieceType: "queen",
      color: color,
      tileName: tileName,
      initialPosition: tile.position.clone(),
    };

    scene.add(model);

    queens[tileName] = model;
  });
};

export const loadQueen = (model) => {
  // Create white queens
  createQueenInstance(model, "D1", TEXTURES.wood, PIECES.white); // White Queen (d1)

  // Create black queens
  createQueenInstance(model, "D8", TEXTURES.wood, PIECES.black); // Black Queen (d8)
};
