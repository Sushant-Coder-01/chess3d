import { scene, camera, canvas } from "./src/scene.js";
import { createBoard } from "./src/board.js";
import { setupControls } from "./src/controls.js";
import { animate } from "./src/animate.js";
import loadModels from "./src/pieces/loadModels.js";
import { lightning } from "./src/lightning.js";
import { createTiles } from "./src/tiles.js";
import { selectModels } from "./src/selectModels/eventListeners.js";

// lighning
lightning();

// Add board
createBoard(scene);

// Add tiles
createTiles(scene);

// loadModels
loadModels();

// select the model and tiles
selectModels(scene);

// Setup controls
setupControls(camera, canvas);

// Start animation
animate();
