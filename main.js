import { scene, camera, canvas } from "./src/scene.js";
import { createBoard } from "./src/board.js";
import { setupControls } from "./src/controls.js";
import { animate } from "./src/animate.js";
import loadModels from "./src/models/loadModels.js";
import { lightning } from "./src/lightning.js";

// lighning
lightning();

// Add board
createBoard(scene);

// loadModels
loadModels();

// Setup controls
setupControls(camera, canvas);

// Start animation
animate();
