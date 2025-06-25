import { AmbientLight } from "three";
import { scene } from "./scene";

export const lightning = () => {
  const ambientLignt = new AmbientLight(0xffffff, 1);
  scene.add(ambientLignt);
};
