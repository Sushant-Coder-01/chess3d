import { AmbientLight, DirectionalLight } from "three";
import { RGBELoader } from "three/examples/jsm/Addons.js";
import { scene } from "./scene";
import * as THREE from "three";

export const lightning = () => {
  // Ambient light for base fill
  const ambientLight = new AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
  directionalLight.position.set(0, 10, 0);
  // directionalLight.castShadow = true;

  // directionalLight.shadow.mapSize.width = 1024;
  // directionalLight.shadow.mapSize.height = 1024;
  // directionalLight.shadow.camera.near = 0.5;
  // directionalLight.shadow.camera.far = 50;

  scene.add(directionalLight);

  const spotLight = new THREE.SpotLight(0xffffff, 5);
  spotLight.position.set(0, 15, 0);
  spotLight.castShadow = true;
  scene.add(spotLight);

  scene.background = new THREE.Color(0x101010);

  // Load HDRI for realistic environment reflections
  // const rgbeLoader = new RGBELoader();
  // rgbeLoader.load("scene_1.hdr", function (texture) {
  //   texture.mapping = THREE.EquirectangularReflectionMapping;

  // scene.background = texture;
  // scene.environment = texture;
  // });
};
