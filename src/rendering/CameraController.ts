import * as THREE from "three";

export class CameraController {
  readonly camera = new THREE.OrthographicCamera(-12, 12, 8, -8, 0.1, 100);

  constructor() {
    this.camera.position.set(12, 18, 12);
    this.camera.lookAt(12, 0, 8);
  }

  resize(width: number, height: number): void {
    const aspect = width / Math.max(height, 1);
    const vertical = 9;
    this.camera.left = -vertical * aspect;
    this.camera.right = vertical * aspect;
    this.camera.top = vertical;
    this.camera.bottom = -vertical;
    this.camera.updateProjectionMatrix();
  }
}
