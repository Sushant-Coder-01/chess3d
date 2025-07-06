import * as THREE from "three";
import { camera, sizes } from "../scene";
import { tileFromChessNotation } from "../tiles";
import { getTopModelParent } from "./getTopModelParent";
import { getBoardState } from "../boardState";
import {
  clearPreviousHighlights,
  highlightedValidTiles,
  highlightModel,
  highlightTile,
  lastHighlightedModel,
  lastHighlightedTile,
} from "./highlight";
import { STATE } from "../constant";
import { pieceMoveValidators } from "../validatePiecesMoves.js";
import { highlightValidMoves } from "./highlightValidMoves";
import isMoveLegal from "../kingInCheck.js";
import { moveModelToValidTile } from "./moveModel.js";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export const handleTileClick = (scene) => {
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

      if (model?.userData?.captured) return;

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
};
