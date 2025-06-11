import { scene, camera, canvas } from "./src/scene.js";
import { createBoard } from "./src/board.js";
import { setupControls } from "./src/controls.js";
import { animate } from "./src/animate.js";
import { createTiles } from "./src/tiles.js";

// Add board
createBoard(scene);

// Add tiles
createTiles(scene);

// Setup controls
setupControls(camera, canvas);

// Start animation
animate();
