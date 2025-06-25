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

const loadModel = (modelName) => {
  return new Promise((resolve, reject) => {
    loader.load(
      `/models/${modelName}/scene.gltf`,
      (gltf) => {
        const model = gltf.scene;
        switch (modelName.toLowerCase()) {
          case "bishop":
            loadBishop(model);
            break;
          case "king":
            loadKing(model);
            break;
          case "knight":
            loadKnight(model);
            break;
          case "pawn":
            loadPawn(model);
            break;
          case "queen":
            loadQueen(model);
            break;
          case "rook":
            loadRook(model);
            break;
          default:
            console.warn(`Unknown model: ${modelName}`);
        }
        resolve(); // Resolving the promise after loading
      },
      undefined,
      (error) => {
        console.error(`Error loading ${modelName}:`, error);
        reject(error); // Reject the promise in case of an error
      }
    );
  });
};

const loadModels = async () => {
  try {
    // Use Promise.all to load all models concurrently
    await Promise.all(models.map(loadModel));
    console.log("All models loaded successfully!");
  } catch (error) {
    console.error("Error loading models:", error);
  }
};

export default loadModels;
