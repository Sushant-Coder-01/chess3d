import { PIECES } from "../constant";

const getValidKingMoves = (currentPosition, modelUserData, boardState) => {
  const validMoves = [];
  const files = "ABCDEFGH";
  const file = currentPosition[0];
  const rank = parseInt(currentPosition[1]);

  const color = modelUserData.color;

  const directions = [
    [+1, 0], // E
    [-1, 0], // W
    [0, +1], // N
    [0, -1], // S
    [+1, +1], // NE
    [+1, -1], // SE
    [-1, +1], // NW
    [-1, -1], // SW
  ];

  for (const [df, dr] of directions) {
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

export default getValidKingMoves;
