import { camera, scene, sizes } from "./scene";
import {
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

let lastHighlightedTile = null;
let lastHighlightedModel = null;
let highlightedValidTiles = [];

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
      const model = getTopModelParent(clicked);

      const modelName = model.name;
      const isPiece =
        modelName.startsWith("Knight_") ||
        modelName.startsWith("Rook_") ||
        modelName.startsWith("Pawn_") ||
        modelName.startsWith("King_") ||
        modelName.startsWith("Queen_") ||
        modelName.startsWith("Bishop_");

      const isTile = /^[a-h][1-8]$/i.test(clicked.name);

      // Step 1: Move model if a valid tile is clicked

      if (isTile && highlightedValidTiles.includes(clicked)) {
        if (STATE.currentModel) {
          moveModelToValidTile(STATE.currentModel, clicked);
          STATE.currentModel = null;
        }
        return;
      }

      // Step 2: Toggle off if same model or tile clicked again
      if (
        (lastHighlightedModel && lastHighlightedModel === model) ||
        (lastHighlightedTile && lastHighlightedTile === clicked)
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

      // Step 5: Only tile clicked (not a valid move or model) → highlight tile
      if (isTile) {
        highlightTile(clicked);
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
  if (lastHighlightedTile) {
    lastHighlightedTile.material.color.set(lastHighlightedTile.originalColor);
    lastHighlightedTile = null;
  }

  if (lastHighlightedModel) {
    lastHighlightedModel.traverse((child) => {
      if (child.isMesh && child.originalColor !== undefined) {
        child.material.color.set(child.originalColor);
      }
    });
    lastHighlightedModel = null;
  }

  // Clear valid tile highlights
  highlightedValidTiles.forEach((tile) => restoreTile(tile));
  highlightedValidTiles = [];
}

function highlightValidMoves(validTiles) {
  validTiles.forEach((tilePos) => {
    const tile = tileFromChessNotation(tilePos);
    const info = getBoardState();
    if (info[tilePos]) {
      saveAndSetTileWithColor(tile, VALID_MOVE_COLOR_WITH_ENEMY);
    } else {
      saveAndSetTileWithColor(tile, VALID_MOVE_COLOR);
    }
    highlightedValidTiles.push(tile);
  });
}

function saveAndSetTileWithColor(tile, color) {
  tile.originalColor = tile.material.color.getHex();
  tile.material.color.set(color);
}

function moveModelToValidTile(model, tile) {
  movePieceToTile(model, tile, () => {
    clearPreviousHighlights();
    lastHighlightedTile = null;
  });
}
