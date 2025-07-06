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

const modelLoaders = {
  bishop: loadBishop,
  king: loadKing,
  knight: loadKnight,
  pawn: loadPawn,
  queen: loadQueen,
  rook: loadRook,
};

const loadModel = (modelName) => {
  return new Promise((resolve, reject) => {
    loader.load(
      `/models/${modelName}/scene.gltf`,
      (gltf) => {
        const model = gltf.scene;

        const loaderFunction = modelLoaders[modelName.toLowerCase()];

        if (loaderFunction) {
          loaderFunction(model);
          resolve();
        } else {
          console.warn(`Unknown model: ${modelName}`);
          reject(`Unknown model: ${modelName}`);
        }
      },
      undefined,
      (error) => {
        console.error(`Error loading ${modelName}:`, error);
        reject(error);
      }
    );
  });
};

const loadModels = async () => {
  try {
    await Promise.all(models.map((modelName) => loadModel(modelName)));
  } catch (error) {
    console.error("Error loading models:", error);
  }
};

export default loadModels;
