import { PIECES } from "../constant";

const getValidKnightMoves = (currentPosition, modelUserData, boardState) => {
  const validMoves = [];
  const files = "ABCDEFGH";
  const file = currentPosition[0];
  const rank = parseInt(currentPosition[1]);

  const color = modelUserData.color;

  // All 8 possible L-shaped moves for a Knight
  const knightMoves = [
    [+2, +1],
    [+2, -1], // Two squares forward and one square left or right
    [-2, +1],
    [-2, -1], // Two squares backward and one square left or right
    [+1, +2],
    [+1, -2], // One square forward or backward and two squares left or right
    [-1, +2],
    [-1, -2], // One square forward or backward and two squares left or right
  ];

  for (const [df, dr] of knightMoves) {
    const fileIndex = files.indexOf(file) + df;
    const newRank = rank + dr;

    if (
      fileIndex < 0 ||
      fileIndex >= files.length ||
      newRank < 1 ||
      newRank > 8
    ) {
      continue;
    }

    const newPos = `${files[fileIndex]}${newRank}`;
    const occupant = boardState[newPos];

    if (!occupant || occupant.color !== color) {
      validMoves.push(newPos);
    }
  }

  return validMoves;
};

export default getValidKnightMoves;
