import { camera, scene, sizes } from "./scene";
import { SELECTMODEL } from "./constant";
import { tileFromChessNotation } from "./tiles";
import * as THREE from "three";
import getValidPawnMoves from "./validatePiecesMoves.js/pawn";
import { getBoardState } from "./boardState";

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
  // Register click interaction
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

      // Toggle off if same model or tile clicked again
      if (
        (lastHighlightedModel && lastHighlightedModel === model) ||
        (lastHighlightedTile && lastHighlightedTile === clicked)
      ) {
        clearPreviousHighlights();
        return;
      }

      // Clear previous model/tile highlights
      clearPreviousHighlights();

      if (isPiece) {
        const tileName = modelName.split("_")[1];
        const tile = tileFromChessNotation(tileName);

        SELECTMODEL.current = model;

        highlightTile(tile); // Highlight the selected tile
        highlightModel(model); // Highlight the selected model

        // Validate possible moves
        const [type, tilePos] = model.name.split("_");
        const boardState = getBoardState();
        const validTiles = getValidPawnMoves(
          tilePos,
          model.userData,
          boardState
        );

        // Highlight valid moves
        highlightValidMoves(validTiles);
      }

      // Handle direct tile clicks (like "g1")
      const isTile = /^[a-h][1-8]$/i.test(clicked.name);
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
    saveAndSetTile(tile); // Highlight the valid tile
    highlightedValidTiles.push(tile); // Store the highlighted valid tiles
  });
}

function moveModelToValidTile(model, validTile) {
  // Move the model to the selected valid tile
  const tilePosition = tileFromChessNotation(validTile).position;
  model.position.copy(tilePosition);
  restoreTile(lastHighlightedTile);
  lastHighlightedTile = null;
  clearPreviousHighlights();
}
