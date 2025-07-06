import gsap from "gsap";
import { PIECES, SELECTMODEL } from "../constant";
import { getBoardState } from "../boardState";

const capturedPieces = {
  [PIECES.white]: [],
  [PIECES.black]: [],
};

export function playMoveSound() {
  const audio = new Audio("/sounds/preview.mp3");
  audio.volume = 1;
  audio.play();
}

function getYPositionForPiece(type) {
  const pieceHeights = {
    Pawn: 0.7,
    Rook: 0.8,
    Knight: 0.88,
    Bishop: 0.88,
    Queen: 0.3,
    King: 0.8,
  };
  return pieceHeights[type] || 0.7;
}

function updateBoardState(model, tile, type) {
  const boardState = getBoardState();
  const oldPos = model.userData.currentPosition;
  if (oldPos) boardState[oldPos] = null;

  boardState[tile.name] = {
    model,
    color: model.userData.color,
    type,
  };
}

function knockoutAnimation(target, type, boardState) {
  const color = target.model.userData.color;
  const [targetType, pos] = target.model.name.split("_");

  boardState[pos] = null;
  target.model.userData.captured = true;

  const targetPosition = target.model.userData.currentPosition;
  if (targetPosition && boardState[targetPosition]?.model === target.model) {
    boardState[targetPosition] = null;
  }

  capturedPieces[color].push(target.model);

  const index = capturedPieces[color].length - 1;
  const col = index % 8;
  const row = Math.floor(index / 8);

  const baseX = color === PIECES.white ? 5 : -5;
  const offsetX = baseX + row * (color === PIECES.white ? 1 : -1);
  const offsetZ = -4 + col * 0.8;
  const offsetY = getYPositionForPiece(targetType);

  gsap.to(target.model.position, {
    x: offsetX,
    y: offsetY,
    z: offsetZ,
    duration: 0.3,
    ease: "power2.inOut",
    onComplete: () => {},
  });
}

export function movePieceToTile(model, tile, onComplete = () => {}) {
  if (!model || !tile) return;

  const boardState = getBoardState();
  const tilePosition = tile.position.clone();
  const [type] = model.name.split("_");
  const newName = `${type}_${tile.name}`;
  const targetY = getYPositionForPiece(type);
  const originalColor = tile.originalColor;
  const capturedModel = boardState[tile.name];

  const afterMove = () => {
    model.name = newName;
    model.userData.currentPosition = tile.name;
    updateBoardState(model, tile, type);

    playMoveSound();
    tile.material.color.set(SELECTMODEL.color);
    setTimeout(() => {
      tile.material.color.set(originalColor);
    }, 300);

    onComplete();
  };

  if (type === "Knight") {
    gsap.to(model.position, {
      x: tilePosition.x,
      z: tilePosition.z,
      y: targetY + 0.5,
      duration: 0.25,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(model.position, {
          y: targetY,
          duration: 0.2,
          ease: "bounce2.out",
          onComplete: () => {
            if (capturedModel) {
              knockoutAnimation(capturedModel, type, boardState);
            }
            afterMove();
          },
        });
      },
    });
    return;
  }

  const stepTimeline = gsap.timeline({ onComplete: afterMove });

  const startX = model.position.x;
  const startZ = model.position.z;
  const endX = tilePosition.x;
  const endZ = tilePosition.z;
  const dx = Math.abs(endX - startX);
  const dz = Math.abs(endZ - startZ);
  const steps = Math.max(dx, dz);

  for (let i = 1; i <= steps; i++) {
    const factor = i / steps;
    stepTimeline.to(model.position, {
      x: startX + (endX - startX) * factor,
      z: startZ + (endZ - startZ) * factor,
      y: targetY + 0.2,
      duration: 0.15,
      ease: "power2.out",
    });

    stepTimeline.to(model.position, {
      y: targetY,
      duration: 0.1,
      ease: "bounce.out",
      onComplete: () => {
        if (i === steps && capturedModel) {
          knockoutAnimation(capturedModel, type, boardState);
        }
      },
    });
  }
}
