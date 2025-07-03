import getValidBishopMoves from "./bishop";
import getValidKingMoves from "./king";
import getValidKnightMoves from "./knight";
import getValidPawnMoves from "./pawn";
import getValidQueenMoves from "./queen";
import getValidRookMoves from "./rook";

export const pieceMoveValidators = {
  Pawn: getValidPawnMoves,
  Rook: getValidRookMoves,
  Knight: getValidKnightMoves,
  Bishop: getValidBishopMoves,
  Queen: getValidQueenMoves,
  King: getValidKingMoves,
};
