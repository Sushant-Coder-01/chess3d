import {
  saveAndSetTileWithColor,
  highlightEnemyModel,
  highlightedValidTiles,
} from "./highlight";
import { getBoardState } from "../boardState";
import { tileFromChessNotation } from "../tiles";
import { VALID_MOVE_COLOR, VALID_MOVE_COLOR_WITH_ENEMY } from "../constant";
import * as THREE from "three";

export function highlightValidMoves(validTiles) {
  const boardState = getBoardState();
  validTiles.forEach((tilePos) => {
    const tile = tileFromChessNotation(tilePos);

    if (!tile) return;

    if (boardState[tilePos]) {
      // Save original material before overwriting
      tile.originalMaterial = tile.material;
      tile.material = new THREE.MeshBasicMaterial({
        color: VALID_MOVE_COLOR_WITH_ENEMY,
        transparent: true,
        opacity: 0.3,
      });

      const model = boardState[tilePos].model;
      if (model) highlightEnemyModel(model);
    } else {
      // Save original material before overwriting
      tile.originalMaterial = tile.material;
      tile.material = new THREE.MeshBasicMaterial({
        color: VALID_MOVE_COLOR,
        transparent: true,
        opacity: 0.3,
      });
    }

    highlightedValidTiles.push(tile);
  });
}
