import {
  saveAndSetTileWithColor,
  highlightEnemyModel,
  highlightedValidTiles,
} from "./highlight";
import { getBoardState } from "../boardState";
import { tileFromChessNotation } from "../tiles";
import { VALID_MOVE_COLOR, VALID_MOVE_COLOR_WITH_ENEMY } from "../constant";

export function highlightValidMoves(validTiles) {
  const boardState = getBoardState();
  validTiles.forEach((tilePos) => {
    const tile = tileFromChessNotation(tilePos);
    if (boardState[tilePos]) {
      saveAndSetTileWithColor(tile, VALID_MOVE_COLOR_WITH_ENEMY);
      const model = boardState[tilePos].model;
      if (model) highlightEnemyModel(model);
    } else {
      saveAndSetTileWithColor(tile, VALID_MOVE_COLOR);
    }
    highlightedValidTiles.push(tile);
  });
}
