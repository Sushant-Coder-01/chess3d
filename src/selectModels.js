import { Raycaster, Vector2 } from "three";
import { camera, scene, sizes } from "./scene";
import { SELECTMODEL } from "./constant";

let lastHighlighted = null;
const raycaster = new Raycaster();
const mouse = new Vector2();

export function getTopModelParent(object) {
  let current = object;
  while (current.parent && current.parent.type !== "Scene") {
    current = current.parent;
  }
  return current;
}

export const selectModels = () => {
  // Register click interaction
  window.addEventListener("click", handleTileClick(scene));

  handleTileClick(scene);
};

function handleTileClick(scene) {
  return function (event) {
    // Convert mouse to normalized device coordinates
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = -(event.clientY / sizes.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    // Intersect with all scene objects
    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
      const clicked = intersects[0].object;
      const model = getTopModelParent(clicked);
      console.log(model);

      if (clicked.name.startsWith("")) {
        highlightTile(clicked);
      }
    }
  };
}

function highlightTile(tile) {
  // Restore previous tile color
  if (lastHighlighted) {
    lastHighlighted.material.color.set(lastHighlighted.originalColor);
  }

  // Save original color and highlight
  tile.originalColor = tile.material.color.getHex();
  tile.material.color.set(SELECTMODEL.color);

  lastHighlighted = tile;
}
