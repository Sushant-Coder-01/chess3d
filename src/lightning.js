import { AmbientLight, DirectionalLight } from "three";
import { scene } from "./scene";

export const lightning = () => {
  const ambientLignt = new AmbientLight(0xffffff, 1);
  scene.add(ambientLignt);

  const light = new DirectionalLight(0xffffff, 2);
  light.position.set(0, 10, 0);
  scene.add(light);
};
