import { PIECES } from "../constant";

const getValidQueenMoves = (currentPosition, modelUserData, boardState) => {
  const validMoves = [];
  const files = "ABCDEFGH";
  const file = currentPosition[0];
  const rank = parseInt(currentPosition[1]);

  const color = modelUserData.color;

  const directions = [
    [+1, 0], // East
    [-1, 0], // West
    [0, +1], // North
    [0, -1], // South
    [+1, +1], // Northeast
    [+1, -1], // Southeast
    [-1, +1], // Northwest
    [-1, -1], // Southwest
  ];

  for (const [df, dr] of directions) {
    let fileIndex = files.indexOf(file);
    let r = rank;

    while (true) {
      fileIndex += df;
      r += dr;

      if (fileIndex < 0 || fileIndex >= files.length || r < 1 || r > 8) break;

      const newPos = `${files[fileIndex]}${r}`;
      const occupant = boardState[newPos];

      if (!occupant) {
        validMoves.push(newPos);
      } else {
        if (occupant.color !== color) {
          validMoves.push(newPos);
        }
        break;
      }
    }
  }

  return validMoves;
};

export default getValidQueenMoves;
