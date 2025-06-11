import { OrbitControls } from "three/examples/jsm/Addons.js";

let orbitalControls;

function setupControls(camera, canvas) {
  orbitalControls = new OrbitControls(camera, canvas);
  orbitalControls.minDistance = 8;
  orbitalControls.maxDistance = 20;
  orbitalControls.enableDamping = true;
}

export { setupControls, orbitalControls };
