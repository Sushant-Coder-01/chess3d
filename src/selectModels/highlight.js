import { SELECTMODEL } from "../constant";
import * as THREE from "three";

let lastHighlightedTile = null;
let lastHighlightedModel = null;
let highlightedValidTiles = [];
const highlightedEnemyModels = [];

export function clearPreviousHighlights() {
  // Restore selected tile
  if (lastHighlightedTile) {
    if (lastHighlightedTile.originalMaterial) {
      lastHighlightedTile.material = lastHighlightedTile.originalMaterial;
      delete lastHighlightedTile.originalMaterial;
    } else if (lastHighlightedTile.originalColor !== undefined) {
      lastHighlightedTile.material.color.setHex(
        lastHighlightedTile.originalColor
      );
      delete lastHighlightedTile.originalColor;
    }
    lastHighlightedTile = null;
  }

  // Restore selected model
  if (lastHighlightedModel) {
    lastHighlightedModel.traverse((child) => {
      if (child.isMesh && child.originalColor !== undefined) {
        child.material.color.setHex(child.originalColor);
        delete child.originalColor;
      }
    });
    lastHighlightedModel = null;
  }

  // Restore highlighted tiles
  highlightedValidTiles.forEach((tile) => {
    if (tile.originalMaterial) {
      tile.material = tile.originalMaterial;
      delete tile.originalMaterial;
    } else if (tile.originalColor !== undefined) {
      tile.material.color.setHex(tile.originalColor);
      delete tile.originalColor;
    }
  });
  highlightedValidTiles.length = 0;

  // Restore enemy models
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
  tile.originalMaterial = tile.material;

  tile.material = new THREE.MeshBasicMaterial({
    color: SELECTMODEL.color,
    transparent: true,
    opacity: 0.5,
  });
}

function restoreTile(tile) {
  if (tile.originalMaterial) {
    tile.material = tile.originalMaterial;
    delete tile.originalMaterial;
  } else if (tile.originalColor !== undefined) {
    tile.material.color.set(tile.originalColor);
    delete tile.originalColor;
  }
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
