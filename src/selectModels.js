import { camera, scene, sizes } from "./scene";
import {
  PIECES,
  SELECTMODEL,
  STATE,
  VALID_MOVE_COLOR,
  VALID_MOVE_COLOR_WITH_ENEMY,
} from "./constant";
import { tileFromChessNotation } from "./tiles";
import * as THREE from "three";
import { getBoardState } from "./boardState";
import { movePieceToTile } from "./utils/movePiece";
import { pieceMoveValidators } from "./validatePiecesMoves.js";
import isMoveLegal, { isKingInCheck } from "./kingInCheck.js";

let lastHighlightedTile = null;
let lastHighlightedModel = null;
let highlightedValidTiles = [];
const highlightedEnemyModels = [];

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export function getTopModelParent(object) {
  let current = object;
  while (current.parent && current.parent.type !== "Scene") {
    current = current.parent;
  }
  return current;
}

export const selectModels = () => {
  window.addEventListener("click", handleTileClick(scene));
};

function handleTileClick(scene) {
  return function (event) {
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = -(event.clientY / sizes.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const clicked = intersects[0].object;
      let obj = clicked;
      if (obj.type === "Sprite") {
        // Clicked on a label or 2D sprite
        const tileName = obj.userData?.notation;
        if (tileName) {
          const tile = tileFromChessNotation(tileName);
          obj = tile;
        }
      }

      const model = getTopModelParent(obj);

      const modelName = model.name;
      const isPiece =
        modelName.startsWith("Knight_") ||
        modelName.startsWith("Rook_") ||
        modelName.startsWith("Pawn_") ||
        modelName.startsWith("King_") ||
        modelName.startsWith("Queen_") ||
        modelName.startsWith("Bishop_");

      const isTile = /^[a-h][1-8]$/i.test(obj.name);
      const boardState = getBoardState();
      // Step 1: Move model if a valid tile is clicked

      // Get the target tile (if clicked on piece, get its tile)
      let targetTile = null;

      if (isTile) {
        targetTile = obj;
      } else if (isPiece) {
        // If clicked on a piece, get the tile it's standing on
        const tileName = model.name.split("_")[1];
        targetTile = tileFromChessNotation(tileName);
      }

      // If valid move → proceed to move
      if (targetTile && highlightedValidTiles.includes(targetTile)) {
        if (STATE.currentModel) {
          isMoveLegal(STATE.currentModel, targetTile, boardState);
          moveModelToValidTile(STATE.currentModel, targetTile);
          STATE.currentModel = null;
        }
        return;
      }

      // Step 2: Toggle off if same model or tile clicked again
      if (
        (lastHighlightedModel && lastHighlightedModel === model) ||
        (lastHighlightedTile && lastHighlightedTile === obj)
      ) {
        clearPreviousHighlights();
        STATE.currentModel = null;
        return;
      }

      // Step 3: Clear highlights
      clearPreviousHighlights();

      // Step 4: Piece click → highlight moves
      if (isPiece) {
        const tileName = modelName.split("_")[1];
        const tile = tileFromChessNotation(tileName);

        STATE.currentModel = model;
        highlightTile(tile); // selected tile
        highlightModel(model); // selected model

        // Get moves
        const [type, tilePos] = model.name.split("_");
        const boardState = getBoardState();

        const moveValidator = pieceMoveValidators[type];

        if (moveValidator) {
          const validTiles = moveValidator(tilePos, model.userData, boardState);
          highlightValidMoves(validTiles);
        }

        return;
      }

      if (isTile) {
        // Get the piece at the clicked tile (from boardState)
        const pieceAtTile = boardState[obj.name];
        if (pieceAtTile) {
          highlightTile(obj); // highlight the clicked tile
          highlightModel(pieceAtTile.model); // highlight the piece on the tile
          STATE.currentModel = pieceAtTile.model; // ✅ <== This is the missing part

          // Get the piece's move validation
          const [type, tilePos] = pieceAtTile.model.name.split("_");
          const moveValidator = pieceMoveValidators[type];

          if (moveValidator) {
            const validTiles = moveValidator(
              tilePos,
              pieceAtTile.model.userData,
              boardState
            );
            highlightValidMoves(validTiles); // highlight valid moves for the piece
          }
        }
      }
    }
  };
}

function highlightTile(tile) {
  if (!tile) return;

  // Toggle tile highlight
  if (lastHighlightedTile === tile) {
    restoreTile(tile);
    lastHighlightedTile = null;
  } else {
    if (lastHighlightedTile) restoreTile(lastHighlightedTile);
    saveAndSetTile(tile);
    lastHighlightedTile = tile;
  }
}

function highlightModel(model) {
  if (!model) return;

  // Toggle model highlight
  if (lastHighlightedModel === model) {
    restoreModel(model);
    lastHighlightedModel = null;
  } else {
    if (lastHighlightedModel) restoreModel(lastHighlightedModel);
    saveAndSetModel(model);
    lastHighlightedModel = model;
  }
}

function saveAndSetTile(tile) {
  tile.originalColor = tile.material.color.getHex();
  tile.material.color.set(SELECTMODEL.color);
}

function restoreTile(tile) {
  tile.material.color.set(tile.originalColor);
}

function saveAndSetModel(model) {
  model.traverse((child) => {
    if (child.isMesh) {
      child.originalColor = child.material.color.getHex();
      child.material.color.set(SELECTMODEL.color);
    }
  });
}

function restoreModel(model) {
  model.traverse((child) => {
    if (child.isMesh && child.originalColor !== undefined) {
      child.material.color.set(child.originalColor);
    }
  });
}

function clearPreviousHighlights() {
  // Clear last highlighted tile
  if (lastHighlightedTile && lastHighlightedTile.originalColor) {
    lastHighlightedTile.material.color.setHex(
      lastHighlightedTile.originalColor
    );
    lastHighlightedTile = null;
  }

  // Clear last selected model highlight
  if (lastHighlightedModel) {
    lastHighlightedModel.traverse((child) => {
      if (child.isMesh && child.originalColor !== undefined) {
        child.material.color.setHex(child.originalColor);
      }
    });
    lastHighlightedModel = null;
  }

  // Clear valid tile move highlights
  highlightedValidTiles.forEach((tile) => {
    if (tile.originalColor) {
      tile.material.color.setHex(tile.originalColor);
    }
  });
  highlightedValidTiles.length = 0;

  // Clear enemy model highlights
  highlightedEnemyModels.forEach(({ originalColors }) => {
    originalColors.forEach(({ mesh, color }) => {
      mesh.material.color.setHex(color);
    });
  });
  highlightedEnemyModels.length = 0;
}

function saveAndSetTileWithColor(tile, color) {
  tile.originalColor = tile.material.color.getHex();
  tile.material.color.set(color);
}

function highlightEnemyModel(model) {
  const originalColors = []; // store per mesh

  model.traverse((child) => {
    if (child.isMesh) {
      originalColors.push({
        mesh: child,
        color: child.material.color.getHex(),
      });

      child.material.color.set(0xff0000); // red
    }
  });

  highlightedEnemyModels.push({
    model,
    originalColors,
  });
}

function highlightValidMoves(validTiles) {
  const boardState = getBoardState(); // Call once

  validTiles.forEach((tilePos) => {
    const tile = tileFromChessNotation(tilePos);

    if (boardState[tilePos]) {
      // Tile occupied by enemy → highlight tile + model
      saveAndSetTileWithColor(tile, VALID_MOVE_COLOR_WITH_ENEMY);

      const model = boardState[tilePos].model;
      if (model) {
        highlightEnemyModel(model); // Highlight enemy model red
      }
    } else {
      // Empty tile
      saveAndSetTileWithColor(tile, VALID_MOVE_COLOR);
    }

    highlightedValidTiles.push(tile);
  });
}

function moveModelToValidTile(model, tile) {
  movePieceToTile(model, tile, () => {
    const opponentColor =
      model.userData.color === PIECES.white ? PIECES.black : PIECES.white;
    const info = isKingInCheck(opponentColor, getBoardState());
    if (info?.isInCheck) {
      console.log(`${info.king.model.name} is in CHECK!`);
      // Optional: Show "Check" on UI
    }
    clearPreviousHighlights();
    lastHighlightedTile = null;
  });
}
