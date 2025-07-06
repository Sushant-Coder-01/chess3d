import { handleTileClick } from "./handleTileClick";

export function selectModels(scene) {
  window.addEventListener("click", handleTileClick(scene));
}
