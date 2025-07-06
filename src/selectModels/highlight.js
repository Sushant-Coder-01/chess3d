import { SELECTMODEL } from "../constant";

let lastHighlightedTile = null;
let lastHighlightedModel = null;
let highlightedValidTiles = [];
const highlightedEnemyModels = [];

export function clearPreviousHighlights() {
  if (lastHighlightedTile && lastHighlightedTile.originalColor)
    lastHighlightedTile.material.color.setHex(
      lastHighlightedTile.originalColor
    );
  lastHighlightedTile = null;

  if (lastHighlightedModel) {
    lastHighlightedModel.traverse((child) => {
      if (child.isMesh && child.originalColor !== undefined)
        child.material.color.setHex(child.originalColor);
    });
    lastHighlightedModel = null;
  }

  highlightedValidTiles.forEach((tile) => {
    if (tile.originalColor) tile.material.color.setHex(tile.originalColor);
  });
  highlightedValidTiles.length = 0;

  highlightedEnemyModels.forEach(({ originalColors }) => {
    originalColors.forEach(({ mesh, color }) => {
      mesh.material.color.setHex(color);
    });
  });
  highlightedEnemyModels.length = 0;
}

export function highlightTile(tile) {
  if (!tile) return;
  if (lastHighlightedTile === tile) {
    restoreTile(tile);
    lastHighlightedTile = null;
  } else {
    if (lastHighlightedTile) restoreTile(lastHighlightedTile);
    saveAndSetTile(tile);
    lastHighlightedTile = tile;
  }
}

export function highlightModel(model) {
  if (!model) return;
  if (lastHighlightedModel === model) {
    restoreModel(model);
    lastHighlightedModel = null;
  } else {
    if (lastHighlightedModel) restoreModel(lastHighlightedModel);
    saveAndSetModel(model);
    lastHighlightedModel = model;
  }
}

function saveAndSetTile(tile) {
  tile.originalColor = tile.material.color.getHex();
  tile.material.color.set(SELECTMODEL.color);
}

function restoreTile(tile) {
  tile.material.color.set(tile.originalColor);
}

function saveAndSetModel(model) {
  model.traverse((child) => {
    if (child.isMesh) {
      child.originalColor = child.material.color.getHex();
      child.material.color.set(SELECTMODEL.color);
    }
  });
}

function restoreModel(model) {
  model.traverse((child) => {
    if (child.isMesh && child.originalColor !== undefined)
      child.material.color.set(child.originalColor);
  });
}

export function saveAndSetTileWithColor(tile, color) {
  tile.originalColor = tile.material.color.getHex();
  tile.material.color.set(color);
}

export function highlightEnemyModel(model) {
  const originalColors = [];
  model.traverse((child) => {
    if (child.isMesh) {
      originalColors.push({
        mesh: child,
        color: child.material.color.getHex(),
      });
      child.material.color.set(0xff0000);
    }
  });
  highlightedEnemyModels.push({ model, originalColors });
}

export { highlightedValidTiles, lastHighlightedModel, lastHighlightedTile };
