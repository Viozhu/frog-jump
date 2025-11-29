// Shared Type Definitions

export interface CameraController {
  getCameraY(): number;
  updateCamera(targetY: number): void;
}

