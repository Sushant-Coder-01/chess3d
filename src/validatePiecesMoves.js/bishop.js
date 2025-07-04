import { PIECES } from "../constant";

const getValidBishopMoves = (currentPosition, modelUserData, boardState) => {
  const validMoves = [];
  const files = "ABCDEFGH";
  const file = currentPosition[0];
  const rank = parseInt(currentPosition[1]);

  console.log(modelUserData);

  const color = modelUserData.color;

  const directions = [
    [1, 1], // NE
    [1, -1], // SE
    [-1, 1], // NW
    [-1, -1], // SW
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

export default getValidBishopMoves;
