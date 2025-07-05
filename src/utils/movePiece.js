import gsap from "gsap";
import { SELECTMODEL } from "../constant";
import { getBoardState } from "../boardState";

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

  const scene = model.parent;
  const boardState = getBoardState();

  // ✅ FIX: get model at destination tile
  const capturedModel = boardState[tile.name];

  // ✅ Knockout animation
  const knockoutAnimation = (target) => {
    gsap.to(target.model.rotation, {
      z: Math.PI / 2,
      duration: 0.3,
      ease: "power2.inOut",
    });
    gsap.to(target.model.position, {
      y: 0.2,
      duration: 0.3,
      ease: "power2.inOut",
      onComplete: () => {
        scene.remove(target.model);
      },
    });
  };

  // ✅ "Tup tup" step animation
  const stepTimeline = gsap.timeline({
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

  const startX = model.position.x;
  const startZ = model.position.z;
  const endX = tilePosition.x;
  const endZ = tilePosition.z;

  const dx = Math.abs(tilePosition.x - model.position.x);
  const dz = Math.abs(tilePosition.z - model.position.z);
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
        // ✅ Play knockout at the very end of the move
        if (capturedModel) {
          knockoutAnimation(capturedModel);
        }
      },
    });
  }
}
