import { orbitalControls } from "./controls.js";
import { scene, camera, renderer } from "./scene.js";

function animate() {
  renderer.render(scene, camera);
  orbitalControls.update();
  window.requestAnimationFrame(animate);
}

export { animate };
