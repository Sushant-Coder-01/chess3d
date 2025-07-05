import { AmbientLight, DirectionalLight } from "three";
import { RGBELoader } from "three/examples/jsm/Addons.js";
import { scene } from "./scene";
import * as THREE from "three";

export const lightning = () => {
  // Ambient light for base fill
  const ambientLight = new AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  // Directional light to simulate sunlight/moonlight
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(15, 0, 12);
  directionalLight.castShadow = true;

  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;

  scene.add(directionalLight);

  // Load HDRI for realistic environment reflections
  const rgbeLoader = new RGBELoader();
  rgbeLoader.load("scene_1.hdr", function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;

    scene.background = texture;
    scene.environment = texture;
  });
};
