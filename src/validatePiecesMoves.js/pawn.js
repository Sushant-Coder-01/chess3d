import { PIECES } from "../constant";

const getValidPawnMoves = (currentPosition, modelUserData, boardState) => {
  const validMoves = [];
  const file = currentPosition[0]; // previously file
  const rank = parseInt(currentPosition[1]); // previously rank

  const color = modelUserData.color;
  const moveDirection = color === PIECES.white ? 1 : -1;

  const startingRow = color === PIECES.white ? 2 : 7;

  const oneStepForward = `${file}${rank + moveDirection}`;
  const twoStepsForward = `${file}${rank + 2 * moveDirection}`;

  if (rank === startingRow) {
    if (!boardState[oneStepForward]) {
      validMoves.push(oneStepForward);
    }
    if (!boardState[oneStepForward] && !boardState[twoStepsForward]) {
      validMoves.push(twoStepsForward);
    }
  } else {
    if (!boardState[oneStepForward]) {
      validMoves.push(oneStepForward);
    }
  }

  const files = "ABCDEFGH";
  const fileIndex = files.indexOf(file);
  const captureLeft = files[fileIndex - 1] + (rank + moveDirection);
  const captureRight = files[fileIndex + 1] + (rank + moveDirection);

  if (boardState[captureLeft] && boardState[captureLeft].color !== color) {
    validMoves.push(captureLeft);
  }
  if (boardState[captureRight] && boardState[captureRight].color !== color) {
    validMoves.push(captureRight);
  }

  return validMoves.filter((move) => /^[A-H][1-8]$/.test(move));
};

export default getValidPawnMoves;
