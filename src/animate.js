import { orbitalControls } from "./controls.js";
import { scene, camera, renderer } from "./scene.js";
import * as THREE from "three";

function animate() {
  renderer.render(scene, camera);
  orbitalControls.update();
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  window.requestAnimationFrame(animate);
}

export { animate };
