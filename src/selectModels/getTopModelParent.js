export function getTopModelParent(object) {
  let current = object;
  while (current.parent && current.parent.type !== "Scene") {
    current = current.parent;
  }
  return current;
}
