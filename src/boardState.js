import { bishops } from "./pieces/bishop";
import { kings } from "./pieces/king";
import { knights } from "./pieces/knight";
import { pawns } from "./pieces/pawn";
import { queens } from "./pieces/queen";
import { rooks } from "./pieces/rook";

export const getBoardState = () => {
  const pieceGroup = [pawns, bishops, rooks, kings, knights, queens];
  const boardState = {};

  for (const piece of pieceGroup) {
    for (const tile in piece) {
      const model = piece[tile];

      if (!model?.name || model.userData?.captured) continue;

      const [type, position] = model.name.split("_");

      const color =
        model.userData?.color ||
        (type === type.toUpperCase() ? "white" : "black");

      boardState[position] = {
        piece: type,
        color,
        model,
      };
    }
  }

  return boardState;
};
