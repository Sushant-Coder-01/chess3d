import { OrbitControls } from "three/examples/jsm/Addons.js";

let orbitalControls;

function setupControls(camera, canvas) {
  orbitalControls = new OrbitControls(camera, canvas);
  orbitalControls.minDistance = 2;
  orbitalControls.maxDistance = 12;
  orbitalControls.enableDamping = true;
  orbitalControls.minPolarAngle = 0;
  orbitalControls.maxPolarAngle = Math.PI / 2.4;
}

export { setupControls, orbitalControls };
