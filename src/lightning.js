import { AmbientLight } from "three";
import { scene } from "./scene";
import * as THREE from "three";

export const lightning = () => {
  const ambientLight = new AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
  directionalLight.position.set(0, 10, 0);
  directionalLight.castShadow = true;

  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;

  scene.add(directionalLight);

  const spotLight = new THREE.SpotLight(0xffffff, 5);
  spotLight.position.set(0, 15, 0);
  spotLight.castShadow = true;
  scene.add(spotLight);

  scene.background = new THREE.Color(0x1a1a1a);
};
