import gsap from "gsap";
import { SELECTMODEL } from "../constant";

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

export function movePieceToTile(model, tile, onComplete = () => {}) {
  if (!model || !tile) return;

  const tilePosition = tile.position.clone();
  const [type] = model.name.split("_");
  const newName = `${type}_${tile.name}`;
  const targetY = getYPositionForPiece(type);
  const originalColor = tile.originalColor;

  gsap.to(model.position, {
    x: tilePosition.x,
    y: targetY,
    z: tilePosition.z,
    duration: 0.4,
    ease: "power2.out",
    onComplete: () => {
      model.name = newName;
      model.userData.currentPosition = tile.name;

      playMoveSound();

      tile.material.color.set(SELECTMODEL.color);
      setTimeout(() => {
        tile.material.color.set(originalColor);
      }, 300);

      onComplete();
    },
  });
}
