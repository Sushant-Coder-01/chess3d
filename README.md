![image](./src/assets/chess3d_pawn_icon.png)

# ♟️ Chess3D

A 3D chess game built with Three.js. Chess3D brings classic chess to life with smooth controls, modern graphics, and an interactive 3D board.

**Chess3D** is a visually immersive 3D chess game built using **Three.js**. The project aims to bring the classic game of strategy to life with realistic 3D models, interactive tiles, and smooth camera controls — all within a browser.

---

## 🚀 Features

- Fully 3D interactive chessboard built with **Three.js**
- Clickable tiles with selection highlighting
- Realistic 3D chess pieces loaded via **GLTF** models
- Modular code structure for scalability
- Responsive resizing and orbit controls

---

## 📦 Project Structure

```bash
Root
|__public
|  |
|  |__models           # Stores 3D models of chess pieces (e.g., .glb/.gltf)
|__src/
   ├── assets          # Stores images, icons, and other assets
   ├── animate.js      # Handles animations (piece movements, etc.)
   ├── board.js        # Generates and renders the chessboard grid
   ├── controls.js     # Handles player interactions, such as piece movement
   ├── scene.js        # Sets up scene, camera, renderer, and lighting
   ├── tiles.js        # Handles tile grid and interaction logic
   ├── pieces/         # Individual pieces (bishop, king, knight, etc.)
   │   ├── bishop.js   # Loads and places the bishop piece
   │   ├── king.js     # Loads and places the king piece
   │   ├── knight.js   # Loads and places the knight piece
   │   ├── pawn.js     # Loads and places the pawn piece
   │   ├── queen.js    # Loads and places the queen piece
   │   └── rook.js     # Loads and places the rook piece
   ├── main.js         # Entry point, initializes all components
   ├── index.css       # CSS styles for the game
   └── index.html      # HTML file to host the game
```
