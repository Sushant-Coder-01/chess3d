import { movePieceToTile } from "../utils/movePiece";
import { getBoardState } from "../boardState";
import { PIECES } from "../constant";
import { clearPreviousHighlights } from "./highlight";
import { isKingInCheck } from "../kingInCheck";

export function moveModelToValidTile(model, tile) {
  movePieceToTile(model, tile, () => {
    const opponentColor =
      model.userData.color === PIECES.white ? PIECES.black : PIECES.white;
    const info = isKingInCheck(opponentColor, getBoardState());
    if (info?.isInCheck) {
      console.log(`${info.king.model.name} is in CHECK!`);
    }
    clearPreviousHighlights();
  });
}
