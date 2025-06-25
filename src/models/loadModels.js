import { AmbientLight } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { loadBishop } from "./bishop";
import { loadKing } from "./king";
import { loadRook } from "./rook";
import { loadQueen } from "./queen";
import { loadKnight } from "./knight";
import { loadPawn } from "./pawn";

const loader = new GLTFLoader();
const models = ["bishop", "king", "knight", "pawn", "queen", "rook"];

const loadModels = () => {
  models.forEach((modelName) => {
    loader.load(
      `/models/${modelName}/scene.gltf`,
      (gltf) => {
        const model = gltf.scene;

        switch (modelName.toLowerCase()) {
          case "bishop":
            return loadBishop(model);
          case "king":
            return loadKing(model);
          case "knight":
            return loadKnight(model);
          case "pawn":
            return loadPawn(model);
          case "queen":
            return loadQueen(model);
          case "rook":
            return loadRook(model);
          default:
            console.warn(`Unknown model: ${modelName}`);
        }
      },
      undefined,
      (error) => {
        console.error(`Error loading ${modelName}:`, error);
      }
    );
  });
};

export default loadModels;
