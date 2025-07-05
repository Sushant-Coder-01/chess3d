import { pieceMoveValidators } from "./validatePiecesMoves.js";

function isMoveLegal(model, targetTile, boardState) {
  const originalPos = model.userData.currentPosition;
  const capturedModel = boardState[targetTile.name];

  // 🧠 Simulate move
  boardState[targetTile.name] = model;
  delete boardState[originalPos];
  model.userData.currentPosition = targetTile.name;

  const inCheck = isKingInCheck(model.userData.color, boardState);

  // 🧹 Restore state
  model.userData.currentPosition = originalPos;
  boardState[originalPos] = model;
  if (capturedModel) {
    boardState[targetTile.name] = capturedModel;
  } else {
    delete boardState[targetTile.name];
  }

  return !inCheck?.isInCheck;
}

export function isKingInCheck(color, boardState) {
  const king = Object.values(boardState).find(
    (piece) =>
      piece?.model?.name.startsWith("King") &&
      piece.model.userData.color === color
  );

  if (!king) return false;
  const kingPos = king.model.name.split("_")[1];
  for (const piece of Object.values(boardState)) {
    if (!piece.model) return;
    if (piece?.model?.userData?.color !== color) {
      const attackMoves = getValidMoves(piece.model, boardState);
      if (attackMoves?.includes(kingPos)) {
        return { isInCheck: true, king: king };
      }
    }
  }

  return { isInCheck: false, king: king };
}

function getValidMoves(model, boardState) {
  const [type, tilePos] = model?.name?.split("_");

  const checkValidator = pieceMoveValidators[type];

  const moves = checkValidator(tilePos, model.userData, boardState);

  return moves;
}

export default isMoveLegal;
