import { movePieceToTile } from "./movePiece";
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
      showCheckToast(info.king.model.name);
    } else {
      disableCheckToast();
    }
    clearPreviousHighlights();
  });
}

function showCheckToast(kingName) {
  const toast = document.getElementById("check-toast");
  toast.style.display = "block";

  // Update the content of the toast with the King's name
  toast.innerHTML = `⚠️ ${kingName} is in CHECK!`;
}

function disableCheckToast() {
  const toast = document.getElementById("check-toast");
  toast.style.display = "none";
}
